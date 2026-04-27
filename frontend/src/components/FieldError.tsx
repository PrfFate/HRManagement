type FieldErrorProps = {
  message?: string;
};

export function FieldError({ message }: FieldErrorProps) {
  return <p className="field-error">{message ?? ""}</p>;
}
