import { Icon } from "@/components/ui";

const feelOptions = [
  { value: "😊 Good", label: "Good", icon: "circle-check", tone: "good" },
  { value: "😐 Okay", label: "Okay", icon: "triangle", tone: "okay" },
  { value: "😖 Burning / Itching", label: "Burning / Itching", icon: "close", tone: "burning" },
] as const;

export function CheckInFeelPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <fieldset className="check-in-feel">
    <legend>How does your skin feel today?</legend>
    <div className="check-in-feel__options" role="group" aria-label="Choose how your skin feels">
      {feelOptions.map(option => <button key={option.value} type="button" className="check-in-feel__option" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>
        <span className={`check-in-feel__icon check-in-feel__icon--${option.tone}`}><Icon name={option.icon} size={31}/></span>
        <span>{option.label}</span>
      </button>)}
    </div>
    <label className="check-in-feel__severe"><input type="radio" name="skin-feel" checked={value === "Swelling / Rash / Hives"} onChange={() => onChange("Swelling / Rash / Hives")}/> Swelling / Rash / Hives</label>
  </fieldset>;
}

export function PhotoGuide() {
  return <div className="photo-guide"><span className="photo-guide__oval" aria-hidden="true"/><div><h3>Photo guide</h3><p>Frame the same area at the same angle each time.</p></div></div>;
}
