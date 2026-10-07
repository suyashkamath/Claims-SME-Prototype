import { useMemo, useState } from 'react';
import type { ProductConfig } from '../data/products';
import type { Insurer } from '../data/types';
import { cattleDocuments, type CattleCause, type CattleClaimKind } from '../data/cattle';
import { marineDocuments, type MarineCargo, type MarineMode } from '../data/marine';
import { CLAIM_MODES, GMC_REJECTED_DOCS, HEALTH_SUB_CATEGORIES, ROOM_TYPES, gmcDocuments, type ClaimMode } from '../data/gmc';
import { calculateCompensation, type WcCalcKind } from '../data/workmen';
import { newTicketNumber, saveClaim, type Claim } from '../store';
import { CalcBreakdown } from './CompensationCalculator';

interface Props {
  product: ProductConfig;
  insurer: Insurer;
  onExit: () => void;
  onTrack: (ticket: string) => void;
}

type Step = 1 | 2 | 3 | 4;
type Errors = Record<string, string>;

const CATTLE_CAUSES: CattleCause[] = ['Disease', 'Vehicular accident', 'Other accident'];
const STEP_LABELS = ['Policy Details', 'Claim Questions', 'Documents'];
// upper bound for admission / discharge dates
const today = new Date().toISOString().slice(0, 10);

export default function ClaimWizard({ product, insurer: selectedInsurer, onExit, onTrack }: Props) {
  const isWc = product.id === 'workmen';
  // group PA follows the PA flow, but the policyholder is the employer and the
  // claim is for one insured member
  const isGroup = product.id === 'gpa';
  const isPa = product.id === 'pa' || isGroup;
  const isTravel = product.id === 'travel';
  // group mediclaim follows the Health claim form of the ClaimManagement project
  const isGmc = product.id === 'gmc';
  const isMachinery = product.id === 'machinery';
  const isCattle = product.id === 'cattle';
  const isMarine = product.id === 'marine';
  // "Others": the insured or a partner enters the insurance type, insurer and documents themselves
  const isOthers = product.id === 'others';
  // policyholder is the employer for these products
  const isEmployer = isWc || isGroup || isGmc || isMachinery;
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Errors>({});

  // Step 1 — others only
  const [filedBy, setFiledBy] = useState<'Insured' | 'Partner' | ''>('');
  const [insuranceType, setInsuranceType] = useState('');
  const [otherInsurerName, setOtherInsurerName] = useState('');
  const insurer: Insurer = isOthers ? { ...selectedInsurer, name: otherInsurerName.trim() || 'the insurer' } : selectedInsurer;

  // Step 1
  const [clientName, setClientName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');

  // Step 2 — common
  const [filed, setFiled] = useState<'Yes' | 'No' | ''>('');

  // Step 2 — YES branch
  const [insurerStatus, setInsurerStatus] = useState<'UNDER_PROCESS' | 'REJECTED' | 'OTHERS' | ''>('');
  const [otherConcern, setOtherConcern] = useState('');
  const [insurerClaimNo, setInsurerClaimNo] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [remarks, setRemarks] = useState('');

  // Step 2 — NO branch
  const [categoryId, setCategoryId] = useState('');
  const [tripType, setTripType] = useState<'International' | 'Domestic' | ''>('');
  const [tripStart, setTripStart] = useState('');
  const [tripEnd, setTripEnd] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentPlace, setIncidentPlace] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [description, setDescription] = useState('');

  // Step 2 — NO branch, workmen compensation only
  const [employeeName, setEmployeeName] = useState('');
  const [employeeAge, setEmployeeAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [monthlyWage, setMonthlyWage] = useState('');
  const [disabilityPercent, setDisabilityPercent] = useState('');
  const [disabilityDays, setDisabilityDays] = useState('');
  const [medicalBills, setMedicalBills] = useState('');

  // Step 2 — NO branch, group mediclaim only
  const [claimMode, setClaimMode] = useState<ClaimMode>('Cashless');
  const [subCategory, setSubCategory] = useState('');
  const [hospitalState, setHospitalState] = useState('');
  const [hospitalCity, setHospitalCity] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [roomType, setRoomType] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');

  // Step 2 — NO branch, machinery only
  const [machineName, setMachineName] = useState('');
  const [powerSurge, setPowerSurge] = useState<'Yes' | 'No' | ''>('');

  // Step 2 — NO branch, cattle only
  const [cattleKind, setCattleKind] = useState<CattleClaimKind | ''>('');
  const [cattleCause, setCattleCause] = useState<CattleCause | ''>('');
  const [animalType, setAnimalType] = useState('');
  const [animalTag, setAnimalTag] = useState('');
  const [hypothecated, setHypothecated] = useState<'Yes' | 'No' | ''>('');

  // Step 2 — NO branch, marine only
  const [marineMode, setMarineMode] = useState<MarineMode | ''>('');
  const [marineCargo, setMarineCargo] = useState<MarineCargo | ''>('');
  const [cargoDesc, setCargoDesc] = useState('');
  const [transportDocNo, setTransportDocNo] = useState('');

  // Contact (both branches)
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Step 3 — others: documents added by the user
  const [customDocs, setCustomDocs] = useState<string[]>([]);
  const [newDoc, setNewDoc] = useState('');

  // Step 3
  const [files, setFiles] = useState<Record<string, string>>({});

  // Step 4
  const [ticket, setTicket] = useState('');

  const category = product.categories.find((c) => c.id === categoryId);

  const wcEstimate = isWc && category
    ? calculateCompensation({
      kind: category.id as WcCalcKind,
      monthlyWage: Number(monthlyWage) || 0,
      age: Number(employeeAge) || 16,
      applyWageCeiling: false,
      disabilityPercent: Number(disabilityPercent) || 0,
      disabilityDays: Number(disabilityDays) || 0,
      medicalBills: Number(medicalBills) || 0,
    })
    : null;

  const subCategories = isGmc && category ? HEALTH_SUB_CATEGORIES[category.label] ?? [] : [];
  const isHospitalization = isGmc && category?.label === 'Indoor Hospitalization';

  const requiredDocs = useMemo(() => {
    if (isGmc && filed === 'Yes' && insurerStatus === 'REJECTED') return GMC_REJECTED_DOCS;
    if (isGmc && filed === 'No') return gmcDocuments(claimMode, category?.label ?? '', subCategory);
    if (isOthers && filed === 'No') return ['Policy document', ...customDocs];
    if (isMarine && filed === 'No') return marineDocuments(marineMode, marineCargo);
    if (isCattle && filed === 'No') return cattleDocuments(cattleKind || 'Death', cattleCause, hypothecated === 'Yes');
    // the electricity bill only supports a power-surge claim
    if (isMachinery && filed === 'No') return product.generalDocuments.filter((d) => powerSurge === 'Yes' || d !== 'Electricity Bill');
    if (filed === 'Yes') {
      return [
        'Claim intimation / acknowledgement from insurer',
        `${product.label} policy document`,
        ...(insurerStatus === 'REJECTED' ? ['Claim rejection letter from insurer'] : ['Insurer query / deficiency letter (if any)']),
      ];
    }
    return [...product.generalDocuments, ...(category?.documents ?? [])];
  }, [filed, insurerStatus, category, product, isGmc, claimMode, subCategory, isMachinery, powerSurge, isCattle, cattleKind, cattleCause, hypothecated, isMarine, marineMode, marineCargo, isOthers, customDocs]);

  const uploadedCount = requiredDocs.filter((d) => files[d]).length;

  // ── validation ──
  const validateStep1 = (): Errors => {
    const e: Errors = {};
    if (isOthers) {
      if (!filedBy) e.filedBy = 'Please select who is filing the claim.';
      if (!insuranceType.trim()) e.insuranceType = 'Please enter the type of insurance.';
      if (!otherInsurerName.trim()) e.otherInsurerName = 'Please enter the insurance company.';
    }
    if (!clientName.trim()) e.clientName = 'Please enter the client / insured name.';
    if (!policyNumber.trim()) e.policyNumber = 'Please enter the policy number.';
    return e;
  };

  const validateStep2 = (): Errors => {
    const e: Errors = {};
    if (!filed) e.filed = 'Please select Yes or No.';
    if (filed === 'Yes') {
      if (!insurerStatus) e.insurerStatus = 'Please select the current claim status.';
      if (!insurerClaimNo.trim()) e.insurerClaimNo = 'Please enter the claim number given by the insurer.';
      if (insurerStatus === 'REJECTED' && !rejectionReason.trim()) e.rejectionReason = 'Please mention the rejection reason.';
      if (insurerStatus === 'OTHERS' && !otherConcern.trim()) e.otherConcern = 'Please describe your concern.';
      if (insurerStatus !== 'OTHERS' && !remarks.trim()) e.remarks = 'Please describe your query.';
    }
    if (filed === 'No' && isWc) {
      if (!categoryId) e.categoryId = 'Please select the type of claim.';
      if (!employeeName.trim()) e.employeeName = 'Please enter the employee name.';
      if (!(Number(employeeAge) >= 14 && Number(employeeAge) <= 80)) e.employeeAge = 'Please enter a valid age.';
      if (!occupation.trim()) e.occupation = 'Please enter the occupation.';
      if (!(Number(monthlyWage) > 0)) e.monthlyWage = 'Please enter the monthly wage.';
      if (!incidentDate) e.incidentDate = 'Please enter the date of accident.';
      if (!incidentPlace.trim()) e.incidentPlace = 'Please enter the place of accident.';
      if (categoryId === 'permanent' && !(Number(disabilityPercent) > 0 && Number(disabilityPercent) <= 100)) e.disabilityPercent = 'Enter a % between 1 and 100.';
      if (categoryId === 'temporary' && !(Number(disabilityDays) > 0)) e.disabilityDays = 'Please enter the number of days.';
      if (categoryId === 'injury' && !(Number(medicalBills) > 0)) e.medicalBills = 'Please enter the medical bills total.';
      if (!description.trim()) e.description = 'Please describe what happened.';
    }
    if (filed === 'No' && isPa) {
      if (!categoryId) e.categoryId = 'Please select the type of claim.';
      if (isGroup && !employeeName.trim()) e.employeeName = 'Please enter the insured member name.';
      if (!incidentDate) e.incidentDate = 'Please enter the date of accident.';
      if (!incidentPlace.trim()) e.incidentPlace = 'Please enter the place of accident.';
      if (!description.trim()) e.description = 'Please describe what happened.';
    }
    if (filed === 'No' && isGmc) {
      if (!categoryId) e.categoryId = 'Please select the claim category.';
      if (subCategories.length && !subCategory) e.subCategory = 'Please select the sub-category.';
      if (!employeeName.trim()) e.employeeName = 'Please enter the patient / member name.';
      if (isHospitalization) {
        if (!hospitalName.trim()) e.hospitalName = 'Please enter the hospital name.';
        if (!incidentDate) e.incidentDate = 'Please enter the date of admission.';
        if (incidentDate && dischargeDate && dischargeDate < incidentDate) e.dischargeDate = 'Discharge cannot be before admission.';
      }
    }
    if (filed === 'No' && isMachinery) {
      if (!machineName.trim()) e.machineName = 'Please enter the machine details.';
      if (!powerSurge) e.powerSurge = 'Please select Yes or No.';
      if (!incidentDate) e.incidentDate = 'Please enter the date of breakdown.';
      if (!incidentPlace.trim()) e.incidentPlace = 'Please enter the location.';
      if (!description.trim()) e.description = 'Please describe what happened.';
    }
    if (filed === 'No' && isCattle) {
      if (!cattleKind) e.cattleKind = 'Please select death or disability.';
      if (!animalType.trim()) e.animalType = 'Please enter the animal type / breed.';
      if (!animalTag.trim()) e.animalTag = 'Please enter the ear tag number.';
      if (!hypothecated) e.hypothecated = 'Please select Yes or No.';
      if (!cattleCause) e.cattleCause = 'Please select the cause.';
      if (!incidentDate) e.incidentDate = 'Please enter the date.';
      if (!incidentPlace.trim()) e.incidentPlace = 'Please enter the place.';
      if (!description.trim()) e.description = 'Please describe what happened.';
    }
    if (filed === 'No' && isMarine) {
      if (!marineMode) e.marineMode = 'Please select the mode of transport.';
      if (!marineCargo) e.marineCargo = 'Please select the type of cargo.';
      if (!cargoDesc.trim()) e.cargoDesc = 'Please describe the cargo.';
      if (!transportDocNo.trim()) e.transportDocNo = 'Please enter the document number.';
      if (!incidentDate) e.incidentDate = 'Please enter the date of incident.';
      if (!incidentPlace.trim()) e.incidentPlace = 'Please enter the location.';
      if (!description.trim()) e.description = 'Please describe the damage or loss.';
    }
    if (filed === 'No' && isOthers) {
      if (!incidentDate) e.incidentDate = 'Please enter the date of incident.';
      if (!incidentPlace.trim()) e.incidentPlace = 'Please enter the place of incident.';
      if (!description.trim()) e.description = 'Please describe what happened.';
    }
    if (filed === 'No' && isTravel) {
      if (!categoryId) e.categoryId = 'Please select the type of claim.';
      if (!tripType) e.tripType = 'Please select the trip type.';
      if (!tripStart) e.tripStart = 'Required.';
      if (!tripEnd) e.tripEnd = 'Required.';
      if (tripStart && tripEnd && tripEnd < tripStart) e.tripEnd = 'End date cannot be before start date.';
      if (!incidentDate) e.incidentDate = 'Please enter the date of incident.';
      if (!incidentPlace.trim()) e.incidentPlace = 'Please enter the place of incident.';
      if (!claimAmount.trim() || Number(claimAmount) <= 0) e.claimAmount = 'Please enter an estimated claim amount.';
      if (!description.trim()) e.description = 'Please describe what happened.';
    }
    if (filed) {
      if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Please enter a valid email.';
      if (!/^[6-9]\d{9}$/.test(mobile)) e.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    return e;
  };

  const next = () => {
    const e = step === 1 ? validateStep1() : validateStep2();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep((s) => (s + 1) as Step);
      window.scrollTo({ top: 0 });
    }
  };

  const back = () => {
    setErrors({});
    if (step === 1) onExit();
    else setStep((s) => (s - 1) as Step);
  };

  const addCustomDoc = () => {
    const d = newDoc.trim();
    if (d && d !== 'Policy document' && !customDocs.includes(d)) setCustomDocs((c) => [...c, d]);
    setNewDoc('');
  };

  const submit = () => {
    const t = newTicketNumber(product.ticketPrefix);
    const claim: Claim = {
      ticket: t,
      createdAt: new Date().toISOString(),
      productId: product.id,
      product: isOthers ? insuranceType.trim() : product.label,
      filedBy: isOthers ? filedBy || undefined : undefined,
      insurerId: insurer.id,
      insurerName: insurer.name,
      clientName,
      policyNumber,
      filedWithInsurer: filed as 'Yes' | 'No',
      insurerStatus: filed === 'Yes' ? (insurerStatus as 'UNDER_PROCESS' | 'REJECTED' | 'OTHERS') : undefined,
      insurerClaimNumber: filed === 'Yes' ? insurerClaimNo : undefined,
      categoryId: category?.id,
      categoryLabel: isOthers ? insuranceType.trim() : isMarine && filed === 'No' ? `${marineMode} cargo — ${marineCargo}` : isCattle && filed === 'No' ? `${cattleKind} — ${cattleCause}` : category && subCategory ? `${category.label} — ${subCategory}` : category?.label,
      claimMode: isGmc && filed === 'No' ? claimMode : undefined,
      incidentDate: incidentDate || undefined,
      incidentPlace: isHospitalization ? [hospitalName, hospitalCity, hospitalState].filter(Boolean).join(', ') : incidentPlace || undefined,
      description: filed === 'No' ? description : insurerStatus === 'OTHERS' ? otherConcern : remarks,
      claimAmount: wcEstimate && filed === 'No' ? `INR ${Math.round(wcEstimate.amount)}` : claimAmount ? `${currency} ${claimAmount}` : undefined,
      employeeName: isEmployer && filed === 'No' ? employeeName : undefined,
      machineName: isMachinery && filed === 'No' ? machineName : undefined,
      shipment: isMarine && filed === 'No' ? `${cargoDesc} · ${marineMode === 'Air' ? 'AWB' : 'B/L'} ${transportDocNo}` : undefined,
      animal: isCattle && filed === 'No' ? `${animalType} · Tag ${animalTag}` : undefined,
      employeeAge: isWc && filed === 'No' ? employeeAge : undefined,
      monthlyWage: isWc && filed === 'No' ? monthlyWage : undefined,
      documents: requiredDocs.filter((d) => files[d]),
      status: uploadedCount < requiredDocs.length ? 'DOCS_PENDING' : 'REGISTERED',
      // a claim already filed with the insurer is past intimation + claim form
      stage: filed === 'Yes' ? 3 : uploadedCount < requiredDocs.length ? 1 : 2,
    };
    saveClaim(claim);
    setTicket(t);
    setStep(4);
    window.scrollTo({ top: 0 });
  };

  const err = (k: string) => errors[k] && <p className="field-error">{errors[k]}</p>;

  // ── render ──
  return (
    <section className="fade-up wizard">
      {step < 4 && (
        <div className="wizard-top">
          <button className="link-back" onClick={back}>
            <i className="fas fa-arrow-left" /> {step === 1 ? (isOthers ? 'Back to Products' : 'Back to Claim Guide') : 'Back'}
          </button>
          <div className="stepper">
            {STEP_LABELS.map((l, i) => (
              <div key={l} className={'stepper-item' + (step > i + 1 ? ' done' : step === i + 1 ? ' active' : '')}>
                <span className="stepper-dot">{step > i + 1 ? <i className="fas fa-check" /> : i + 1}</span>
                <span className="stepper-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={step === 2 || step === 3 ? 'wizard-layout' : 'wizard-single'}>
        {(step === 2 || step === 3) && (
          <aside className="card policy-card">
            <span className="pill pill-teal">Active Policy</span>
            <div className="guide-icon"><i className={'fas ' + product.icon} /></div>
            <p className="eyebrow muted-label">{isEmployer ? 'Employer / Insured' : 'Insured Name'}</p>
            <p className="policy-name">{clientName}</p>
            <p className="eyebrow muted-label">Insurer</p>
            <p className="policy-value">{insurer.name}</p>
            <p className="eyebrow muted-label">Policy No.</p>
            <p className="policy-value mono">{policyNumber}</p>
            <p className="eyebrow muted-label policy-foot">SME · {isOthers ? insuranceType : product.label}</p>
          </aside>
        )}

        <div className="wizard-body">
          {/* STEP 1 */}
          {step === 1 && isOthers && (
            <div className="card card-pad-lg">
              <h2 className="card-title-lg">Tell us about the policy</h2>
              <p className="muted mb">Insurance not listed? Enter the details yourself to begin the claim.</p>
              <p className="field-label">Who is filing this claim?</p>
              <div className="choice-grid mb-sm">
                {(['Insured', 'Partner'] as const).map((o) => (
                  <button key={o} className={'choice' + (filedBy === o ? ' selected' : '')} onClick={() => setFiledBy(o)}>
                    <i className={'fas ' + (o === 'Insured' ? 'fa-user' : 'fa-handshake')} /> {o === 'Insured' ? 'Insured (self)' : 'Partner (on behalf of client)'}
                  </button>
                ))}
              </div>
              {err('filedBy')}
              <div className="grid-2 mt">
                <label className="field">
                  <span className="field-label">Type of Insurance</span>
                  <input className="input" value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)} placeholder="e.g. Fire Insurance, Shop Insurance" />
                  {err('insuranceType')}
                </label>
                <label className="field">
                  <span className="field-label">Insurance Company</span>
                  <input className="input" value={otherInsurerName} onChange={(e) => setOtherInsurerName(e.target.value)} placeholder="e.g. Liberty General Insurance" />
                  {err('otherInsurerName')}
                </label>
              </div>
              <label className="field mt">
                <span className="field-label">{filedBy === 'Partner' ? 'Client / Insured Name' : 'Your Name (Insured)'}</span>
                <input className="input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Rahul Sharma" />
                {err('clientName')}
              </label>
              <label className="field">
                <span className="field-label">Policy Number</span>
                <input className="input mono" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())} placeholder={product.policyPlaceholder} />
                {err('policyNumber')}
              </label>
              <button className="btn btn-primary btn-block" onClick={next}>
                Continue <i className="fas fa-arrow-right" />
              </button>
            </div>
          )}

          {step === 1 && !isOthers && (
            <div className="card card-pad-lg">
              <h2 className="card-title-lg">Claim on behalf of your client</h2>
              <p className="muted mb">Enter the policy details to begin a {product.short} claim with <b>{insurer.name}</b>.</p>
              <label className="field">
                <span className="field-label">{isEmployer ? 'Employer / Insured Name' : 'Client / Insured Name'}</span>
                <input className="input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={isEmployer ? 'e.g. Sharma Engineering Works' : 'e.g. Rahul Sharma'} />
                {err('clientName')}
              </label>
              <label className="field">
                <span className="field-label">Policy Number</span>
                <input className="input mono" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())} placeholder={product.policyPlaceholder} />
                {err('policyNumber')}
              </label>
              <button className="btn btn-primary btn-block" onClick={next}>
                Continue <i className="fas fa-arrow-right" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="stack">
              <div className="card">
                <h3 className="q-title">Have you filed the claim with the insurance company?</h3>
                <div className="choice-grid">
                  {(['Yes', 'No'] as const).map((o) => (
                    <button key={o} className={'choice big' + (filed === o ? ' selected' : '')}
                      onClick={() => { setFiled(o); setErrors({}); setFiles({}); }}>
                      {o}
                    </button>
                  ))}
                </div>
                {err('filed')}
              </div>

              {/* YES branch */}
              {filed === 'Yes' && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">What is the current status of your claim?</h3>
                    <div className="choice-grid three">
                      <button className={'choice' + (insurerStatus === 'UNDER_PROCESS' ? ' selected' : '')} onClick={() => setInsurerStatus('UNDER_PROCESS')}>
                        <i className="fas fa-hourglass-half" /> Under Process
                      </button>
                      <button className={'choice' + (insurerStatus === 'REJECTED' ? ' selected' : '')} onClick={() => setInsurerStatus('REJECTED')}>
                        <i className="fas fa-circle-xmark" /> Rejected
                      </button>
                      <button className={'choice' + (insurerStatus === 'OTHERS' ? ' selected' : '')} onClick={() => setInsurerStatus('OTHERS')}>
                        <i className="fas fa-ellipsis" /> Others
                      </button>
                    </div>
                    {err('insurerStatus')}
                    {insurerStatus === 'OTHERS' && (
                      <label className="field mt fade-up">
                        <span className="field-label">Describe your concern</span>
                        <textarea className="input" rows={4} value={otherConcern} onChange={(e) => setOtherConcern(e.target.value)}
                          placeholder="Please elaborate on your concern regarding this claim…" />
                        {err('otherConcern')}
                      </label>
                    )}
                  </div>

                  {insurerStatus && (
                    <div className="card fade-up">
                      <div className="grid-2">
                        <label className="field">
                          <span className="field-label">Claim Number</span>
                          <input className="input mono" value={insurerClaimNo} onChange={(e) => setInsurerClaimNo(e.target.value.toUpperCase())} placeholder="Enter claim no. from insurer" />
                          {err('insurerClaimNo')}
                        </label>
                        <label className="field">
                          <span className="field-label">Contact Person <em>(optional)</em></span>
                          <input className="input" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="TPA / Claim manager name" />
                        </label>
                      </div>
                      {insurerStatus === 'REJECTED' && (
                        <label className="field">
                          <span className="field-label">Rejection Reason (as per insurer)</span>
                          <input className="input" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g. Pre-existing condition, document not submitted…" />
                          {err('rejectionReason')}
                        </label>
                      )}
                      {insurerStatus !== 'OTHERS' && (
                      <label className="field">
                        <span className="field-label">Query / Remarks</span>
                        <textarea className="input" rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)}
                          placeholder={insurerStatus === 'REJECTED' ? 'Describe your rejection query…' : 'What help do you need with this claim?'} />
                        {err('remarks')}
                      </label>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* NO branch */}
              {filed === 'No' && isWc && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">What type of workmen compensation claim is this?</h3>
                    <div className="choice-grid">
                      {product.categories.map((c) => (
                        <button key={c.id} className={'choice' + (categoryId === c.id ? ' selected' : '')} onClick={() => setCategoryId(c.id)}>
                          <i className={'fas ' + c.icon} /> {c.label}
                        </button>
                      ))}
                    </div>
                    {err('categoryId')}
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Employee details</h3>
                    <div className="grid-2">
                      <label className="field">
                        <span className="field-label">Employee Name</span>
                        <input className="input" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="e.g. Suresh Patil" />
                        {err('employeeName')}
                      </label>
                      <label className="field">
                        <span className="field-label">Age (last birthday)</span>
                        <input type="number" min="14" max="80" className="input" value={employeeAge} onChange={(e) => setEmployeeAge(e.target.value)} placeholder="e.g. 35" />
                        {err('employeeAge')}
                      </label>
                    </div>
                    <div className="grid-2 mt">
                      <label className="field">
                        <span className="field-label">Occupation / Designation</span>
                        <input className="input" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Machine operator" />
                        {err('occupation')}
                      </label>
                      <label className="field">
                        <span className="field-label">Monthly Wage (₹)</span>
                        <input type="number" min="0" className="input" value={monthlyWage} onChange={(e) => setMonthlyWage(e.target.value)} placeholder="e.g. 15000" />
                        {err('monthlyWage')}
                      </label>
                    </div>
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Accident details</h3>
                    <div className="grid-2">
                      <label className="field">
                        <span className="field-label">Date of Accident</span>
                        <input type="date" className="input" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                        {err('incidentDate')}
                      </label>
                      <label className="field">
                        <span className="field-label">Place of Accident (Worksite)</span>
                        <input className="input" value={incidentPlace} onChange={(e) => setIncidentPlace(e.target.value)} placeholder="e.g. Plant 2, MIDC Bhosari, Pune" />
                        {err('incidentPlace')}
                      </label>
                    </div>
                    {categoryId === 'permanent' && (
                      <label className="field mt">
                        <span className="field-label">Disability % <em>(as per doctor's report; 100 = total)</em></span>
                        <input type="number" min="1" max="100" className="input" value={disabilityPercent} onChange={(e) => setDisabilityPercent(e.target.value)} placeholder="e.g. 100" />
                        {err('disabilityPercent')}
                      </label>
                    )}
                    {categoryId === 'temporary' && (
                      <label className="field mt">
                        <span className="field-label">Disability period (days, as per doctor's certificate)</span>
                        <input type="number" min="1" className="input" value={disabilityDays} onChange={(e) => setDisabilityDays(e.target.value)} placeholder="e.g. 90" />
                        {err('disabilityDays')}
                      </label>
                    )}
                    {categoryId === 'injury' && (
                      <label className="field mt">
                        <span className="field-label">Medical bills total (₹)</span>
                        <input type="number" min="0" className="input" value={medicalBills} onChange={(e) => setMedicalBills(e.target.value)} placeholder="0" />
                        {err('medicalBills')}
                      </label>
                    )}
                    <label className="field">
                      <span className="field-label">What happened?</span>
                      <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe the accident and the injury…" />
                      {err('description')}
                    </label>
                    {category && (
                      <div className="info-box">
                        <i className="fas fa-circle-info" />
                        <span>Make sure the employee has reported the accident to the employer and received treatment at an authorised hospital — the employer then files the claim with <b>{insurer.name}</b> ({insurer.phone}).</span>
                      </div>
                    )}
                  </div>

                  {wcEstimate && (
                    <div className="card fade-up">
                      <h3 className="q-title">Estimated compensation</h3>
                      <CalcBreakdown result={wcEstimate} />
                    </div>
                  )}
                </>
              )}

              {filed === 'No' && isPa && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">What type of {product.short} claim is this?</h3>
                    <div className="choice-grid">
                      {product.categories.map((c) => (
                        <button key={c.id} className={'choice' + (categoryId === c.id ? ' selected' : '')} onClick={() => setCategoryId(c.id)}>
                          <i className={'fas ' + c.icon} /> {c.label}
                        </button>
                      ))}
                    </div>
                    {err('categoryId')}
                  </div>

                  {isGroup && (
                    <div className="card fade-up">
                      <h3 className="q-title">Insured member details</h3>
                      <label className="field">
                        <span className="field-label">Member / Employee Name</span>
                        <input className="input" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="e.g. Suresh Patil" />
                        {err('employeeName')}
                      </label>
                    </div>
                  )}

                  <div className="card fade-up">
                    <h3 className="q-title">Accident details</h3>
                    <div className="grid-2">
                      <label className="field">
                        <span className="field-label">Date of Accident</span>
                        <input type="date" className="input" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                        {err('incidentDate')}
                      </label>
                      <label className="field">
                        <span className="field-label">Place of Accident</span>
                        <input className="input" value={incidentPlace} onChange={(e) => setIncidentPlace(e.target.value)} placeholder="e.g. Western Express Highway, Mumbai" />
                        {err('incidentPlace')}
                      </label>
                    </div>
                    <label className="field">
                      <span className="field-label">What happened?</span>
                      <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="How the accident occurred, the injuries sustained and treatment received…" />
                      {err('description')}
                    </label>
                    {category && (
                      <div className="info-box">
                        <i className="fas fa-circle-info" />
                        <span>Notify <b>{insurer.name}</b> at <b>{insurer.phone}</b> immediately — many insurers have a time limit for reporting claims.</span>
                      </div>
                    )}
                  </div>

                </>
              )}

              {filed === 'No' && isTravel && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">What type of travel claim is this?</h3>
                    <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                      <option value="">Select claim type…</option>
                      {product.categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    {err('categoryId')}
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Trip details</h3>
                    <div className="choice-grid">
                      {(['International', 'Domestic'] as const).map((t) => (
                        <button key={t} className={'choice' + (tripType === t ? ' selected' : '')} onClick={() => setTripType(t)}>
                          <i className={'fas ' + (t === 'International' ? 'fa-earth-asia' : 'fa-map-location-dot')} /> {t}
                        </button>
                      ))}
                    </div>
                    {err('tripType')}
                    <div className="grid-2 mt">
                      <label className="field">
                        <span className="field-label">Trip Start Date</span>
                        <input type="date" className="input" value={tripStart} onChange={(e) => setTripStart(e.target.value)} />
                        {err('tripStart')}
                      </label>
                      <label className="field">
                        <span className="field-label">Trip End Date</span>
                        <input type="date" className="input" value={tripEnd} onChange={(e) => setTripEnd(e.target.value)} />
                        {err('tripEnd')}
                      </label>
                    </div>
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Incident details</h3>
                    <div className="grid-2">
                      <label className="field">
                        <span className="field-label">Date of Incident</span>
                        <input type="date" className="input" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                        {err('incidentDate')}
                      </label>
                      <label className="field">
                        <span className="field-label">Place of Incident (City, Country)</span>
                        <input className="input" value={incidentPlace} onChange={(e) => setIncidentPlace(e.target.value)} placeholder="e.g. Dubai, UAE" />
                        {err('incidentPlace')}
                      </label>
                    </div>
                    <label className="field">
                      <span className="field-label">Estimated Claim Amount</span>
                      <div className="input-group">
                        <select className="input currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          {['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'THB'].map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <input type="number" min="0" className="input" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} placeholder="0" />
                      </div>
                      {err('claimAmount')}
                    </label>
                    <label className="field">
                      <span className="field-label">What happened?</span>
                      <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe the incident…" />
                      {err('description')}
                    </label>
                    {category && (
                      <div className="info-box">
                        <i className="fas fa-circle-info" />
                        <span>Remember to inform <b>{insurer.name}</b> at <b>{insurer.phone}</b> as soon as possible — intimation is the first step of the claim process.</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {filed === 'No' && isGmc && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">Claim Mode</h3>
                    <div className="choice-grid">
                      {CLAIM_MODES.map((m) => (
                        <button key={m} className={'choice' + (claimMode === m ? ' selected' : '')} onClick={() => setClaimMode(m)}>
                          <i className={'fas ' + (m === 'Cashless' ? 'fa-hospital' : 'fa-receipt')} /> {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Claim Category</h3>
                    <div className="choice-grid">
                      {product.categories.map((c) => (
                        <button key={c.id} className={'choice' + (categoryId === c.id ? ' selected' : '')}
                          onClick={() => { setCategoryId(c.id); setSubCategory(''); }}>
                          <i className={'fas ' + c.icon} /> {c.label}
                        </button>
                      ))}
                    </div>
                    {err('categoryId')}
                  </div>

                  {subCategories.length > 0 && (
                    <div className="card fade-up">
                      <h3 className="q-title">Sub-Category</h3>
                      <div className="choice-grid three">
                        {subCategories.map((sc) => (
                          <button key={sc} className={'choice' + (subCategory === sc ? ' selected' : '')} onClick={() => setSubCategory(sc)}>
                            {sc}
                          </button>
                        ))}
                      </div>
                      {err('subCategory')}
                    </div>
                  )}

                  <div className="card fade-up">
                    <h3 className="q-title">Patient details</h3>
                    <label className="field">
                      <span className="field-label">Patient / Member Name</span>
                      <input className="input" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Insured person's name" />
                      {err('employeeName')}
                    </label>
                  </div>

                  {isHospitalization && (
                    <div className="card fade-up">
                      <h3 className="q-title">Hospital Details</h3>
                      <div className="grid-2">
                        <label className="field">
                          <span className="field-label">State</span>
                          <input className="input" value={hospitalState} onChange={(e) => setHospitalState(e.target.value)} placeholder="Hospital State" />
                        </label>
                        <label className="field">
                          <span className="field-label">City</span>
                          <input className="input" value={hospitalCity} onChange={(e) => setHospitalCity(e.target.value)} placeholder="Hospital City" />
                        </label>
                      </div>
                      <div className="grid-2 mt">
                        <label className="field">
                          <span className="field-label">Hospital Name</span>
                          <input className="input" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g. Apollo Hospital" />
                          {err('hospitalName')}
                        </label>
                        <label className="field">
                          <span className="field-label">Room Type</span>
                          <select className="input" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                            <option value="">Select Room Type</option>
                            {ROOM_TYPES.map((r) => <option key={r}>{r}</option>)}
                          </select>
                        </label>
                      </div>
                      <div className="grid-2 mt">
                        <label className="field">
                          <span className="field-label">Date of Admission</span>
                          <input type="date" className="input" max={today} value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                          {err('incidentDate')}
                        </label>
                        <label className="field">
                          <span className="field-label">Date of Discharge</span>
                          <input type="date" className="input" max={today} value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} />
                          {err('dischargeDate')}
                        </label>
                      </div>
                    </div>
                  )}

                  {category && (
                    <div className="info-box">
                      <i className="fas fa-circle-info" />
                      <span>Intimation to <b>{insurer.name}</b> ({insurer.phone}) is mandatory — 24 hours before admission or at the time of hospitalization.</span>
                    </div>
                  )}
                </>
              )}

              {filed === 'No' && isMachinery && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">Machine details</h3>
                    <label className="field">
                      <span className="field-label">Machine (name / make / model)</span>
                      <input className="input" value={machineName} onChange={(e) => setMachineName(e.target.value)} placeholder="e.g. CNC Lathe – Ace Micromatic LT-20" />
                      {err('machineName')}
                    </label>
                    <p className="field-label mt">Was the breakdown due to a power surge?</p>
                    <div className="choice-grid">
                      {(['Yes', 'No'] as const).map((o) => (
                        <button key={o} className={'choice' + (powerSurge === o ? ' selected' : '')} onClick={() => setPowerSurge(o)}>
                          <i className={'fas ' + (o === 'Yes' ? 'fa-bolt' : 'fa-gear')} /> {o}
                        </button>
                      ))}
                    </div>
                    {err('powerSurge')}
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Breakdown details</h3>
                    <div className="grid-2">
                      <label className="field">
                        <span className="field-label">Date of Breakdown</span>
                        <input type="date" className="input" max={today} value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                        {err('incidentDate')}
                      </label>
                      <label className="field">
                        <span className="field-label">Location / Plant</span>
                        <input className="input" value={incidentPlace} onChange={(e) => setIncidentPlace(e.target.value)} placeholder="e.g. Unit 3, MIDC Ambad, Nashik" />
                        {err('incidentPlace')}
                      </label>
                    </div>
                    <label className="field">
                      <span className="field-label">What happened?</span>
                      <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="Time of failure, operating conditions, personnel present and the damage observed…" />
                      {err('description')}
                    </label>
                    <div className="info-box">
                      <i className="fas fa-circle-info" />
                      <span>Notify <b>{insurer.name}</b> at <b>{insurer.phone}</b> within 24 hours, ask for the claim reference number, and follow up in writing with the photographs.</span>
                    </div>
                  </div>
                </>
              )}

              {filed === 'No' && isCattle && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">What is the claim for?</h3>
                    <div className="choice-grid">
                      {(['Death', 'Disability'] as const).map((k) => (
                        <button key={k} className={'choice' + (cattleKind === k ? ' selected' : '')} onClick={() => setCattleKind(k)}>
                          <i className={'fas ' + (k === 'Death' ? 'fa-ribbon' : 'fa-crutch')} /> {k} of animal
                        </button>
                      ))}
                    </div>
                    {err('cattleKind')}
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Animal details</h3>
                    <div className="grid-2">
                      <label className="field">
                        <span className="field-label">Animal (type / breed)</span>
                        <input className="input" value={animalType} onChange={(e) => setAnimalType(e.target.value)} placeholder="e.g. Cow – HF crossbreed" />
                        {err('animalType')}
                      </label>
                      <label className="field">
                        <span className="field-label">Ear Tag Number</span>
                        <input className="input mono" value={animalTag} onChange={(e) => setAnimalTag(e.target.value.toUpperCase())} placeholder="e.g. NIA/12345" />
                        {err('animalTag')}
                      </label>
                    </div>
                    <p className="field-label mt">Is the animal hypothecated to a bank (loan)?</p>
                    <div className="choice-grid">
                      {(['Yes', 'No'] as const).map((o) => (
                        <button key={o} className={'choice' + (hypothecated === o ? ' selected' : '')} onClick={() => setHypothecated(o)}>
                          <i className={'fas ' + (o === 'Yes' ? 'fa-building-columns' : 'fa-user')} /> {o}
                        </button>
                      ))}
                    </div>
                    {err('hypothecated')}
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Incident details</h3>
                    <p className="field-label">Cause</p>
                    <div className="choice-grid three">
                      {CATTLE_CAUSES.map((c) => (
                        <button key={c} className={'choice' + (cattleCause === c ? ' selected' : '')} onClick={() => setCattleCause(c)}>
                          {c}
                        </button>
                      ))}
                    </div>
                    {err('cattleCause')}
                    <div className="grid-2 mt">
                      <label className="field">
                        <span className="field-label">Date of {cattleKind === 'Disability' ? 'Incident' : 'Death'}</span>
                        <input type="date" className="input" max={today} value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                        {err('incidentDate')}
                      </label>
                      <label className="field">
                        <span className="field-label">Place (Village / District)</span>
                        <input className="input" value={incidentPlace} onChange={(e) => setIncidentPlace(e.target.value)} placeholder="e.g. Rahuri, Ahmednagar" />
                        {err('incidentPlace')}
                      </label>
                    </div>
                    <label className="field">
                      <span className="field-label">What happened?</span>
                      <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="Symptoms / accident details, treatment given and the veterinary doctor who attended…" />
                      {err('description')}
                    </label>
                    <div className="info-box">
                      <i className="fas fa-circle-info" />
                      <span>Inform <b>{insurer.name}</b> at <b>{insurer.phone}</b> promptly, and get the {cattleKind === 'Disability' ? 'disability' : 'death'} certificate from a qualified veterinary practitioner.</span>
                    </div>
                  </div>
                </>
              )}

              {filed === 'No' && isMarine && (
                <>
                  <div className="card fade-up">
                    <h3 className="q-title">Shipment details</h3>
                    <p className="field-label">Mode of transport</p>
                    <div className="choice-grid">
                      {(['Sea', 'Air'] as const).map((m) => (
                        <button key={m} className={'choice' + (marineMode === m ? ' selected' : '')} onClick={() => setMarineMode(m)}>
                          <i className={'fas ' + (m === 'Sea' ? 'fa-ship' : 'fa-plane')} /> {m}
                        </button>
                      ))}
                    </div>
                    {err('marineMode')}
                    <p className="field-label mt">Type of cargo</p>
                    <div className="choice-grid">
                      {(['Goods / Materials', 'Machinery'] as const).map((c) => (
                        <button key={c} className={'choice' + (marineCargo === c ? ' selected' : '')} onClick={() => setMarineCargo(c)}>
                          <i className={'fas ' + (c === 'Machinery' ? 'fa-gears' : 'fa-boxes-stacked')} /> {c}
                        </button>
                      ))}
                    </div>
                    {err('marineCargo')}
                    <div className="grid-2 mt">
                      <label className="field">
                        <span className="field-label">Cargo description</span>
                        <input className="input" value={cargoDesc} onChange={(e) => setCargoDesc(e.target.value)} placeholder="e.g. 120 cartons of auto parts" />
                        {err('cargoDesc')}
                      </label>
                      <label className="field">
                        <span className="field-label">{marineMode === 'Air' ? 'Air Waybill No.' : 'Bill of Lading No.'}</span>
                        <input className="input mono" value={transportDocNo} onChange={(e) => setTransportDocNo(e.target.value.toUpperCase())} placeholder={marineMode === 'Air' ? 'e.g. 176-12345675' : 'e.g. MAEU123456789'} />
                        {err('transportDocNo')}
                      </label>
                    </div>
                  </div>

                  <div className="card fade-up">
                    <h3 className="q-title">Loss details</h3>
                    <div className="grid-2">
                      <label className="field">
                        <span className="field-label">Date of Incident</span>
                        <input type="date" className="input" max={today} value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                        {err('incidentDate')}
                      </label>
                      <label className="field">
                        <span className="field-label">Location (Port / Place)</span>
                        <input className="input" value={incidentPlace} onChange={(e) => setIncidentPlace(e.target.value)} placeholder="e.g. JNPT, Nhava Sheva" />
                        {err('incidentPlace')}
                      </label>
                    </div>
                    <label className="field">
                      <span className="field-label">Nature of damage or loss</span>
                      <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="What was damaged or lost, how it was found and the quantities affected…" />
                      {err('description')}
                    </label>
                    <div className="info-box">
                      <i className="fas fa-circle-info" />
                      <span>Notify <b>{insurer.name}</b> at <b>{insurer.phone}</b> as soon as possible, keep photographs / videos of the damage, and lodge a notice of claim with the carrier.</span>
                    </div>
                  </div>
                </>
              )}

              {filed === 'No' && isOthers && (
                <div className="card fade-up">
                  <h3 className="q-title">Incident details</h3>
                  <div className="grid-2">
                    <label className="field">
                      <span className="field-label">Date of Incident</span>
                      <input type="date" className="input" max={today} value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                      {err('incidentDate')}
                    </label>
                    <label className="field">
                      <span className="field-label">Place of Incident</span>
                      <input className="input" value={incidentPlace} onChange={(e) => setIncidentPlace(e.target.value)} placeholder="e.g. Andheri East, Mumbai" />
                      {err('incidentPlace')}
                    </label>
                  </div>
                  <label className="field">
                    <span className="field-label">Estimated Claim Amount (₹) <em>(optional)</em></span>
                    <input type="number" min="0" className="input" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} placeholder="0" />
                  </label>
                  <label className="field">
                    <span className="field-label">What happened?</span>
                    <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the incident and the loss or damage…" />
                    {err('description')}
                  </label>
                </div>
              )}

              {filed && (
                <div className="card fade-up">
                  <h3 className="q-title">Contact information</h3>
                  <div className="grid-2">
                    <label className="field">
                      <span className="field-label">Registered Email</span>
                      <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@email.com" />
                      {err('email')}
                    </label>
                    <label className="field">
                      <span className="field-label">Registered Mobile</span>
                      <input className="input" inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} placeholder="10-digit mobile" />
                      {err('mobile')}
                    </label>
                  </div>
                  <button className="btn btn-primary btn-block mt" onClick={next}>
                    Continue to Documents <i className="fas fa-arrow-right" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="card card-pad-lg">
              <div className="row-between">
                <div>
                  <h2 className="card-title-lg">Upload Documents</h2>
                  <p className="muted">
                    {filed === 'No' && isOthers
                      ? <>Policy document + any documents you add below</>
                      : filed === 'No' && isMarine
                      ? <><b>{marineMode} cargo</b> — {marineCargo} · <b>{cargoDesc}</b></>
                      : filed === 'No' && isCattle
                      ? <><b>{cattleKind} of animal</b> — {cattleCause} · Tag <b>{animalTag}</b></>
                      : filed === 'No' && isMachinery
                      ? <>Machinery breakdown — <b>{machineName}</b></>
                      : filed === 'No' && isGmc
                      ? <><b>{claimMode}</b> — <b>{category?.label}</b>{subCategory && <> — <b>{subCategory}</b></>}</>
                      : filed === 'No' ? <>General documents + <b>{category?.label}</b></> : 'Documents related to your existing claim'}
                  </p>
                </div>
                <span className="pill">{uploadedCount} / {requiredDocs.length} uploaded</span>
              </div>
              <div className="progress"><div style={{ width: `${(uploadedCount / requiredDocs.length) * 100}%` }} /></div>

              <ul className="upload-list">
                {requiredDocs.map((d, i) => {
                  const done = !!files[d];
                  return (
                    <li key={d} className={'upload-row' + (done ? ' done' : '')}>
                      <span className="upload-icon"><i className={'fas ' + (done ? 'fa-check' : 'fa-file-arrow-up')} /></span>
                      <div className="upload-text">
                        <p>{d}</p>
                        <small>{done ? files[d] : 'No file selected'}</small>
                      </div>
                      {done && (
                        <button className="icon-btn" title="Remove" onClick={() => setFiles((f) => { const n = { ...f }; delete n[d]; return n; })}>
                          <i className="fas fa-trash" />
                        </button>
                      )}
                      <label className="btn btn-outline btn-sm" htmlFor={'file-' + i}>{done ? 'Replace' : 'Upload'}</label>
                      <input id={'file-' + i} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setFiles((prev) => ({ ...prev, [d]: f.name }));
                          e.target.value = '';
                        }} />
                    </li>
                  );
                })}
              </ul>

              {isOthers && filed === 'No' && (
                <div className="add-doc">
                  <input className="input" value={newDoc} onChange={(e) => setNewDoc(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addCustomDoc(); }}
                    placeholder="Add a document, e.g. Fire brigade report" />
                  <button className="btn btn-outline btn-sm" onClick={addCustomDoc}>
                    <i className="fas fa-plus" /> Add
                  </button>
                </div>
              )}

              {uploadedCount < requiredDocs.length && (
                <div className="info-box warn">
                  <i className="fas fa-triangle-exclamation" />
                  <span>You can submit now and upload the remaining documents later — the claim will be marked <b>Docs Pending</b>.</span>
                </div>
              )}

              <button className="btn btn-primary btn-block mt" onClick={submit}>
                <i className="fas fa-paper-plane" /> Submit Claim
              </button>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="card card-pad-lg success">
              <div className="success-icon"><i className="fas fa-check" /></div>
              <h2 className="card-title-lg">Claim request submitted</h2>
              <p className="muted">Our claims team will reach out to {clientName} shortly.</p>
              <div className="ticket-box">
                <small>Ticket Number</small>
                <span className="mono">{ticket}</span>
              </div>
              <div className="btn-row center">
                <button className="btn btn-primary" onClick={() => onTrack(ticket)}>
                  <i className="fas fa-magnifying-glass" /> Track this Claim
                </button>
                <button className="btn btn-outline" onClick={onExit}>{isOthers ? 'Back to Products' : 'Back to Claim Guide'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
