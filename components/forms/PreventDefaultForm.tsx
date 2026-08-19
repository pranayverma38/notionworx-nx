"use client";

export type PreventDefaultFormProps = React.ComponentPropsWithoutRef<"form">;

/**
 * Client form wrapper: always calls `preventDefault` on submit, then optional `onSubmit`.
 */
export function PreventDefaultForm({
  onSubmit,
  ...rest
}: PreventDefaultFormProps) {
  return (
    <form
      {...rest}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
    />
  );
}
