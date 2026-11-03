import { type ButtonHTMLAttributes, type ComponentProps, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";

export type IconName = "arrow-left" | "arrow-right" | "check" | "chevron-down" | "chevron-right" | "circle-check" | "close" | "info" | "leaf" | "log-out" | "menu" | "moon" | "octagon" | "search" | "sliders" | "sun" | "triangle" | "warning";

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<IconName, ReactNode> = {
    "arrow-left": <><path d="M20 12H5"/><path d="m11 5-7 7 7 7"/></>,
    "arrow-right": <><path d="M4 12h15"/><path d="m13 5 7 7-7 7"/></>,
    "chevron-right": <><path d="m9 6 6 6-6 6"/></>,
    "log-out": <><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"/><path d="m16 8 4 4-4 4"/><path d="M20 12H9"/></>,
    sliders: <><path d="M4 7h9M19 7h1M4 17h1M11 17h9"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    "chevron-down": <><path d="m6 9 6 6 6-6"/></>,
    "circle-check": <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    leaf: <><path d="M20 4C11 3 5 6 5 13c0 4 3 7 7 6 6-1 8-8 8-15Z"/><path d="M4 20c3-5 7-8 12-11"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    moon: <><path d="M19.5 15.5A8 8 0 0 1 8.5 4.5 8.5 8.5 0 1 0 19.5 15.5Z"/></>,
    octagon: <><path d="M8 3h8l5 5v8l-5 5H8l-5-5V8l5-5Z"/><path d="M12 8v5m0 3h.01"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    triangle: <><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4m0 3h.01"/></>,
    warning: <><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4m0 3h.01"/></>,
  };

  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" {...common}>{shapes[name]}</svg>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; size?: "small" | "medium" | "large" };
export function Button({ variant = "primary", size = "medium", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()} {...props} />;
}

export function Card({ className = "", ...props }: ComponentProps<"article">) {
  return <article className={`ui-card ${className}`.trim()} {...props} />;
}

export function Chip({ children, tone = "neutral", className = "" }: { children: ReactNode; tone?: "neutral" | "brand" | "quiet" | "verified"; className?: string }) {
  return <span className={`ui-chip ui-chip--${tone} ${className}`.trim()}>{children}</span>;
}

export function Badge({ children, tone = "brand", className = "" }: { children: ReactNode; tone?: "brand" | "level" | "neutral"; className?: string }) {
  return <span className={`ui-badge ui-badge--${tone} ${className}`.trim()}>{children}</span>;
}

export function Callout({ tone = "info", title, children, className = "", id }: { tone?: "info" | "warning" | "danger" | "success"; title?: string; children: ReactNode; className?: string; id?: string }) {
  const icon: Record<typeof tone, IconName> = { info: "info", warning: "warning", danger: "warning", success: "check" };
  return <aside id={id} className={`callout callout--${tone} ${className}`.trim()}>
    <Icon name={icon[tone]} className="callout__icon" size={21}/>
    <div className="callout__copy">{title && <p className="callout__title">{title}</p>}<div>{children}</div></div>
  </aside>;
}

type LabeledInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: IconName };
export function Input({ label, icon, id, className = "", ...props }: LabeledInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return <label className="field" htmlFor={inputId}><span className="field__label">{label}</span><span className="field__control">{icon && <Icon name={icon} size={19} className="field__icon"/>}<input id={inputId} className={`field__input ${icon ? "field__input--icon" : ""} ${className}`.trim()} {...props}/></span></label>;
}

type LabeledSelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string };
export function Select({ label, id, className = "", children, ...props }: LabeledSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return <label className="field" htmlFor={selectId}><span className="field__label">{label}</span><span className="field__control"><select id={selectId} className={`field__input field__input--select ${className}`.trim()} {...props}>{children}</select><Icon name="chevron-down" size={19} className="field__select-icon"/></span></label>;
}

type LabeledTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string };
export function Textarea({ label, id, className = "", ...props }: LabeledTextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  return <label className="field" htmlFor={textareaId}><span className="field__label">{label}</span><textarea id={textareaId} className={`field__input field__textarea ${className}`.trim()} {...props}/></label>;
}

export function SegmentedChoice<T extends string>({ label, value, options, onChange, className = "" }: { label: string; value: T; options: readonly { value: T; label: string }[]; onChange: (value: T) => void; className?: string }) {
  return <fieldset className={`segmented-choice ${className}`.trim()}><legend>{label}</legend><div className="segmented-choice__options" role="group" aria-label={label}>{options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} className="segmented-choice__option" onClick={() => onChange(option.value)}>{option.label}</button>)}</div></fieldset>;
}

export function Stepper({ steps, className = "" }: { steps: readonly { title: string; detail?: string }[]; className?: string }) {
  return <ol className={`stepper ${className}`.trim()}>{steps.map((step, index) => <li className="stepper__item" key={`${index}-${step.title}`}><span className="stepper__marker" aria-hidden="true">{index + 1}</span><div><h3>{step.title}</h3>{step.detail && <p>{step.detail}</p>}</div></li>)}</ol>;
}

export function EmptyState({ title, children, action, className = "" }: { title?: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return <div className={`empty-state ${className}`.trim()}><div className="empty-state__mark" aria-hidden="true"><Icon name="search" size={30}/></div>{title && <h2>{title}</h2>}<p>{children}</p>{action}</div>;
}

export function PageHeader({ eyebrow, title, children, className = "" }: { eyebrow?: string; title: string; children?: ReactNode; className?: string }) {
  return <header className={`page-header ${className}`.trim()}>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children && <div className="page-header__description">{children}</div>}</header>;
}
