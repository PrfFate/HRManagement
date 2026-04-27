import { FormEvent, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

import { FieldError } from "../../components/FieldError";
import { getTodayInputValue } from "../../lib/format";
import { getErrorMessage, getFieldErrors } from "../../lib/forms";
import { createLeaveRequest } from "../../services/leaveService";
import type { LeaveType, User } from "../../types";

const todayInputValue = getTodayInputValue();

export function LeaveRequestForm({ token, user }: { token: string; user: User }) {
  const [form, setForm] = useState({
    fullName: user.fullName,
    leaveType: "" as LeaveType | "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFieldErrors({});
    setMessage("");

    if (form.startDate && form.startDate < todayInputValue) {
      setFieldErrors({ startDate: "Başlangıç tarihi geçmiş bir tarih olamaz." });
      return;
    }

    if (form.endDate && form.endDate < todayInputValue) {
      setFieldErrors({ endDate: "Bitiş tarihi geçmiş bir tarih olamaz." });
      return;
    }

    if (form.description.length > 500) {
      setFieldErrors({ description: "Açıklama en fazla 500 karakter olabilir." });
      return;
    }

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      setFieldErrors({ endDate: "Başlangıç tarihi bitiş tarihinden sonra olamaz." });
      return;
    }

    setIsSubmitting(true);
    try {
      await createLeaveRequest(token, {
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description || undefined,
      });
      setForm({ ...form, leaveType: "", startDate: "", endDate: "", description: "" });
      setMessage("İzin talebiniz gönderildi.");
    } catch (error) {
      setMessage(getErrorMessage(error));
      setFieldErrors(getFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel-section" id="leaves">
      <h2>İzin Talebi</h2>
      <form className="leave-form-card" onSubmit={handleSubmit}>
        <label>
          <span>Ad Soyad</span>
          <input
            value={form.fullName}
            disabled
          />
          <FieldError />
        </label>
        <label>
          <span>İzin Türü *</span>
          <div className="control-shell">
            <select
              value={form.leaveType}
              onChange={(event) => setForm({ ...form, leaveType: event.target.value as LeaveType })}
            >
              <option value="">Seçiniz</option>
              <option value="ANNUAL">Yıllık İzin</option>
              <option value="SICK">Sağlık İzni</option>
              <option value="PERSONAL">Mazeret</option>
            </select>
            <ChevronDown className="control-icon" size={20} />
          </div>
          <FieldError message={fieldErrors.leaveType} />
        </label>
        <label>
          <span>Başlangıç Tarihi *</span>
          <div className="control-shell">
            <input
              value={form.startDate}
              onChange={(event) => setForm({ ...form, startDate: event.target.value })}
              min={todayInputValue}
              type="date"
            />
            <Calendar className="control-icon" size={20} />
          </div>
          <FieldError message={fieldErrors.startDate} />
        </label>
        <label>
          <span>Bitiş Tarihi *</span>
          <div className="control-shell">
            <input
              min={form.startDate || todayInputValue}
              value={form.endDate}
              onChange={(event) => setForm({ ...form, endDate: event.target.value })}
              type="date"
            />
            <Calendar className="control-icon" size={20} />
          </div>
          <FieldError message={fieldErrors.endDate} />
        </label>
        <label className="full-width">
          <span>Açıklama</span>
          <textarea
            maxLength={500}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="İzin talebiniz ile ilgili ek açıklama girebilirsiniz..."
          />
          <FieldError message={fieldErrors.description} />
        </label>
        {message && <p className="form-message full-width">{message}</p>}
        <button className="primary-button full-width" disabled={isSubmitting} type="submit">
          Gönder
        </button>
      </form>
    </section>
  );
}
