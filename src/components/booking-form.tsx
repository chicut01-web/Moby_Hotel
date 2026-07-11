"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bookingSchema,
  todayISO,
  type BookingInput,
} from "@/lib/validation/booking";
import {
  submitBookingRequest,
  type BookingActionResult,
} from "@/app/actions/booking";
import { fetchAvailableRooms } from "@/app/actions/availability";

export type BookingRoomOption = {
  id: string;
  name: string;
  capacity: number;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  );
}

export function BookingForm({
  rooms,
  preselectedRoomId,
}: {
  rooms: BookingRoomOption[];
  preselectedRoomId?: string;
}) {
  const t = useTranslations("prenota");
  const locale = useLocale() as "it" | "en";
  const [submitted, setSubmitted] = useState<{
    room: string;
    checkIn: string;
    checkOut: string;
  } | null>(null);

  const schema = useMemo(
    () =>
      bookingSchema({
        name: t("form.errors.name"),
        email: t("form.errors.email"),
        room: t("form.errors.room"),
        checkIn: t("form.errors.checkIn"),
        checkOut: t("form.errors.checkOut"),
        checkOutAfter: t("form.errors.checkOutAfter"),
        checkInFuture: t("form.errors.checkInFuture"),
        guestsMin: t("form.errors.guestsMin"),
      }),
    [t],
  );

  const validPreselect = rooms.some((r) => r.id === preselectedRoomId)
    ? preselectedRoomId
    : undefined;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      guest_name: "",
      guest_email: "",
      guest_phone: "",
      room_id: validPreselect ?? "",
      check_in: "",
      check_out: "",
      num_guests: 1,
      message: "",
      locale,
    },
  });

  const watchedRoomId = useWatch({ control, name: "room_id" });
  const watchedCheckIn = useWatch({ control, name: "check_in" });
  const watchedCheckOut = useWatch({ control, name: "check_out" });
  const minDate = todayISO();

  // Disponibilità live: con date valide, il select mostra solo camere libere.
  // Stato derivato dalla chiave-date: niente setState sincrono nell'effect.
  const datesKey =
    watchedCheckIn && watchedCheckOut && watchedCheckOut > watchedCheckIn
      ? `${watchedCheckIn}_${watchedCheckOut}`
      : null;
  const [fetched, setFetched] = useState<{
    key: string;
    rooms: BookingRoomOption[] | null;
  } | null>(null);

  useEffect(() => {
    if (!datesKey) return;
    const [checkIn, checkOut] = datesKey.split("_");
    let cancelled = false;
    fetchAvailableRooms(checkIn, checkOut, locale)
      .then((result) => {
        if (!cancelled) setFetched({ key: datesKey, rooms: result });
      })
      .catch(() => {
        if (!cancelled) setFetched({ key: datesKey, rooms: null });
      });
    return () => {
      cancelled = true;
    };
  }, [datesKey, locale]);

  const availableRooms =
    datesKey && fetched?.key === datesKey ? fetched.rooms : null;
  const checkingAvailability = !!datesKey && fetched?.key !== datesKey;
  const roomOptions = availableRooms ?? rooms;
  const selectedRoom = roomOptions.find((r) => r.id === watchedRoomId);

  // Se la camera scelta non è più tra le disponibili, deselezione.
  useEffect(() => {
    if (
      availableRooms !== null &&
      watchedRoomId &&
      !availableRooms.some((r) => r.id === watchedRoomId)
    ) {
      setValue("room_id", "");
    }
  }, [availableRooms, watchedRoomId, setValue]);

  async function onSubmit(values: BookingInput) {
    let result: BookingActionResult;
    try {
      result = await submitBookingRequest({ ...values, locale });
    } catch {
      setError("root", { message: t("form.errors.generic") });
      return;
    }
    if (result.ok) {
      const room = rooms.find((r) => r.id === values.room_id);
      setSubmitted({
        room: room?.name ?? "",
        checkIn: values.check_in,
        checkOut: values.check_out,
      });
      return;
    }
    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof BookingInput, { message });
      }
    }
    if (result.formError || !result.fieldErrors) {
      setError("root", {
        message: result.formError ?? t("form.errors.generic"),
      });
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-salvia/40 bg-salvia-soft px-8 py-14 text-center"
      >
        <CheckCircle2
          className="mx-auto size-10 text-salvia"
          aria-hidden="true"
        />
        <h2 className="mt-5 text-2xl text-salvia-foreground">
          {t("success.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-salvia-foreground/90">
          {t("success.body", {
            room: submitted.room,
            checkIn: submitted.checkIn,
            checkOut: submitted.checkOut,
          })}
        </p>
        <Button
          variant="outline"
          className="mt-8 rounded-full border-salvia/50"
          onClick={() => {
            setSubmitted(null);
            reset();
          }}
        >
          {t("success.again")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      {/* Soggiorno */}
      <fieldset className="space-y-5">
        <legend className="eyebrow mb-4">{t("form.sectionStay")}</legend>

        <div>
          <Label htmlFor="room_id">{t("form.roomLabel")}</Label>
          <Controller
            control={control}
            name="room_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="room_id"
                  className="mt-1.5 w-full"
                  aria-invalid={!!errors.room_id}
                  aria-describedby={errors.room_id ? "err-room" : undefined}
                >
                  <SelectValue placeholder={t("form.roomPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {roomOptions.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {checkingAvailability ? (
            <p className="mt-1.5 text-xs text-pietra" aria-live="polite">
              {t("form.availability.checking")}
            </p>
          ) : availableRooms !== null ? (
            <p
              className={
                availableRooms.length === 0
                  ? "mt-1.5 text-xs text-destructive"
                  : "mt-1.5 text-xs text-salvia-foreground"
              }
              aria-live="polite"
            >
              {availableRooms.length === 0
                ? t("form.availability.none")
                : t("form.availability.count", {
                    count: availableRooms.length,
                  })}
            </p>
          ) : null}
          <FieldError id="err-room" message={errors.room_id?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="check_in">{t("form.checkInLabel")}</Label>
            <Input
              id="check_in"
              type="date"
              min={minDate}
              className="mt-1.5"
              aria-invalid={!!errors.check_in}
              aria-describedby={errors.check_in ? "err-checkin" : undefined}
              {...register("check_in")}
            />
            <FieldError id="err-checkin" message={errors.check_in?.message} />
          </div>
          <div>
            <Label htmlFor="check_out">{t("form.checkOutLabel")}</Label>
            <Input
              id="check_out"
              type="date"
              min={minDate}
              className="mt-1.5"
              aria-invalid={!!errors.check_out}
              aria-describedby={errors.check_out ? "err-checkout" : undefined}
              {...register("check_out")}
            />
            <FieldError
              id="err-checkout"
              message={errors.check_out?.message}
            />
          </div>
          <div>
            <Label htmlFor="num_guests">{t("form.guestsLabel")}</Label>
            <Input
              id="num_guests"
              type="number"
              min={1}
              max={selectedRoom?.capacity ?? 30}
              className="mt-1.5"
              aria-invalid={!!errors.num_guests}
              aria-describedby={
                errors.num_guests
                  ? "err-guests"
                  : selectedRoom
                    ? "hint-guests"
                    : undefined
              }
              {...register("num_guests", { valueAsNumber: true })}
            />
            {selectedRoom ? (
              <p id="hint-guests" className="mt-1.5 text-xs text-pietra">
                {t("form.capacityHint", { count: selectedRoom.capacity })}
              </p>
            ) : null}
            <FieldError id="err-guests" message={errors.num_guests?.message} />
          </div>
        </div>
      </fieldset>

      {/* Dati ospite */}
      <fieldset className="space-y-5">
        <legend className="eyebrow mb-4">{t("form.sectionGuest")}</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="guest_name">{t("form.nameLabel")}</Label>
            <Input
              id="guest_name"
              autoComplete="name"
              placeholder={t("form.namePlaceholder")}
              className="mt-1.5"
              aria-invalid={!!errors.guest_name}
              aria-describedby={errors.guest_name ? "err-name" : undefined}
              {...register("guest_name")}
            />
            <FieldError id="err-name" message={errors.guest_name?.message} />
          </div>
          <div>
            <Label htmlFor="guest_email">{t("form.emailLabel")}</Label>
            <Input
              id="guest_email"
              type="email"
              autoComplete="email"
              placeholder={t("form.emailPlaceholder")}
              className="mt-1.5"
              aria-invalid={!!errors.guest_email}
              aria-describedby={errors.guest_email ? "err-email" : undefined}
              {...register("guest_email")}
            />
            <FieldError id="err-email" message={errors.guest_email?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="guest_phone">
            {t("form.phoneLabel")}{" "}
            <span className="font-normal text-pietra">
              ({t("form.optional")})
            </span>
          </Label>
          <Input
            id="guest_phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("form.phonePlaceholder")}
            className="mt-1.5"
            {...register("guest_phone")}
          />
        </div>

        <div>
          <Label htmlFor="message">
            {t("form.messageLabel")}{" "}
            <span className="font-normal text-pietra">
              ({t("form.optional")})
            </span>
          </Label>
          <Textarea
            id="message"
            rows={4}
            placeholder={t("form.messagePlaceholder")}
            className="mt-1.5"
            {...register("message")}
          />
        </div>
      </fieldset>

      {errors.root?.message ? (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="rounded-full px-8"
      >
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </Button>
    </form>
  );
}
