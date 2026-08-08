import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPaste, Eraser, Play, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Kbd } from "@/components/ui/kbd";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TemplateCard } from "@/components/automation/TemplateCard";
import { AUTOMATION_TEMPLATES } from "@/data/mockTemplates";
import { SUGGESTED_PROMPTS } from "@/data/suggestedPrompts";
import { AI_PROVIDERS } from "@/data/providers";
import { useSettings } from "@/contexts/settings-context";
import { TASK_PROMPT_MAX, TASK_PROMPT_MIN } from "@/constants/limits";
import { cn } from "@/lib/utils";

export const taskSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(TASK_PROMPT_MIN, `Describe your task in at least ${TASK_PROMPT_MIN} characters.`)
    .max(TASK_PROMPT_MAX, `Keep your task under ${TASK_PROMPT_MAX} characters.`),
  providerId: z.string().min(1, "Choose a provider."),
  enableFallback: z.boolean(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskComposerProps {
  onSubmit: (values: TaskFormValues) => void;
  disabled?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  resetSignal?: number;
  className?: string;
}

/** Task input card with validation, templates, and suggested prompts. */
export function TaskComposer({ onSubmit, disabled, inputRef, resetSignal, className }: TaskComposerProps) {
  const { settings } = useSettings();
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);
  const [pasted, setPasted] = useState(false);
  const localRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      prompt: "",
      providerId: settings.defaultProviderId,
      enableFallback: settings.enableFallback,
    },
  });

  const promptValue = form.watch("prompt");
  const remaining = TASK_PROMPT_MAX - promptValue.length;

  useEffect(() => {
    if (resetSignal !== undefined && resetSignal > 0) {
      form.reset({
        prompt: "",
        providerId: settings.defaultProviderId,
        enableFallback: settings.enableFallback,
      });
      setSelectedTemplate(undefined);
      setPasted(false);
    }
  }, [resetSignal, form, settings]);

  const handleTemplateSelect = (templateId: string, prompt: string) => {
    setSelectedTemplate(templateId);
    form.setValue("prompt", prompt, { shouldValidate: true });
    localRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        form.setValue("prompt", text, { shouldValidate: true });
        setPasted(true);
      }
    } catch {
      form.setError("prompt", { message: "Clipboard access denied. Paste manually with ⌘V." });
    }
  };

  const handleClear = () => {
    form.setValue("prompt", "");
    setPasted(false);
    setSelectedTemplate(undefined);
    localRef.current?.focus();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Form {...form}>
        <form id="task-composer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe the task to automate</FormLabel>
                <FormControl>
                  <Textarea
                    id="task-prompt"
                    placeholder="e.g. Research the market for electric bike subscriptions in Europe and produce a structured report with data points, key players, and risks…"
                    rows={6}
                    maxLength={TASK_PROMPT_MAX}
                    disabled={disabled}
                    className="resize-y text-[15px] leading-relaxed"
                    {...field}
                    ref={(element) => {
                      field.ref(element);
                      localRef.current = element;
                      if (inputRef) inputRef.current = element;
                    }}
                  />
                </FormControl>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {pasted ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <ClipboardPaste className="size-3" /> Pasted from clipboard
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Kbd>⌘</Kbd>
                        <Kbd>⏎</Kbd> to launch
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 cursor-pointer px-2 text-xs"
                      onClick={() => void handlePaste()}
                      disabled={disabled}
                    >
                      <ClipboardPaste className="size-3.5" />
                      Paste
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 cursor-pointer px-2 text-xs"
                      onClick={handleClear}
                      disabled={disabled || !promptValue}
                    >
                      <Eraser className="size-3.5" />
                      Clear
                    </Button>
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        remaining < 200 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
                      )}
                      aria-live="polite"
                    >
                      {promptValue.length}/{TASK_PROMPT_MAX}
                    </span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI provider</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {AI_PROVIDERS.slice(0, 4).map((provider) => {
                        const Icon = provider.icon;
                        const active = field.value === provider.id;
                        return (
                          <button
                            key={provider.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => field.onChange(provider.id)}
                            className={cn(
                              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                              active
                                ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                                : "border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                            )}
                          >
                            <Icon className="size-3.5" style={{ color: provider.color }} />
                            {provider.name}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormDescription>Each step routes to the best model for the job.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableFallback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Automatic fallback</FormLabel>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 px-3.5 py-2.5">
                    <div className="text-xs text-muted-foreground">
                      Retry and switch providers on failure
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="Enable automatic fallback"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full cursor-pointer gap-2 shadow-md shadow-primary/20 transition-transform hover:scale-[1.01] sm:w-auto"
            disabled={disabled}
          >
            <Play className="size-4 fill-current" />
            Launch automation
          </Button>
        </form>
      </Form>

      {/* Suggested prompts */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Wand2 className="size-3" />
          Suggested prompts
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              disabled={disabled}
              onClick={() => {
                setSelectedTemplate(undefined);
                form.setValue("prompt", suggestion.prompt, { shouldValidate: true });
                localRef.current?.focus();
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="size-3" />
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Start from a template
        </p>
        <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {AUTOMATION_TEMPLATES.map((template) => (
            <div key={template.id} className="w-60 shrink-0">
              <TemplateCard
                template={template}
                selected={selectedTemplate === template.id}
                onSelect={() => handleTemplateSelect(template.id, template.prompt)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
