import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock3, FileCheck2, Fingerprint } from "lucide-react";

export type TimelineStep = {
  title: string;
  text: string;
  icon?: LucideIcon;
  complete?: boolean;
};

export function ProofTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="grid gap-3">
      {steps.map((step, index) => {
        const Icon = step.icon || defaultIcons[index] || CheckCircle2;
        return (
          <li className="flex gap-3" key={step.title}>
            <div className="flex flex-col items-center">
              <span
                className={`grid size-9 place-items-center rounded-2xl ${
                  step.complete
                    ? "bg-success text-base-dark"
                    : "bg-base-blue/15 text-base-blue"
                }`}
              >
                <Icon className="size-4" />
              </span>
              {index < steps.length - 1 ? (
                <span className="mt-2 h-full min-h-6 w-px bg-border" />
              ) : null}
            </div>
            <div className="pb-4">
              <p className="font-semibold">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const defaultIcons = [Fingerprint, FileCheck2, Clock3, CheckCircle2];

