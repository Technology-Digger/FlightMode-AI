import { zodResolver } from "@hookform/resolvers/zod";
import { Monitor, Moon, RotateCcw, Sun, Terminal, Zap } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CodeViewer } from "@/components/automation/CodeViewer";
import { ConfirmationModal } from "@/components/feedback/ConfirmationModal";
import { PageHeader } from "@/components/common/PageHeader";
import { FormSelectField } from "@/components/forms/fields";
import { AI_PROVIDERS } from "@/data/providers";
import { KEYBOARD_SHORTCUTS } from "@/constants/shortcuts";
import { API_BASE_URL, GATEWAY_NAME } from "@/constants/app";
import { useSettings } from "@/contexts/settings-context";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/types/settings";

const THEME_OPTIONS: { value: ThemeMode; label: string; description: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", description: "Bright and crisp", icon: Sun },
  { value: "dark", label: "Dark", description: "Easy on the eyes", icon: Moon },
  { value: "system", label: "System", description: "Follow the OS", icon: Monitor },
];

const prefsSchema = z.object({
  defaultProviderId: z.string().min(1, "Choose a provider."),
  enableFallback: z.boolean(),
});
type PrefsValues = z.infer<typeof prefsSchema>;

function Section({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/70 shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function SettingRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-3.5 py-3">
      <div className="min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}

export default function Settings() {
  const { settings, update, updateNotifications, reset } = useSettings();
  const { theme, setTheme } = useTheme();
  const [resetOpen, setResetOpen] = useState(false);

  const form = useForm<PrefsValues>({
    resolver: zodResolver(prefsSchema),
    defaultValues: {
      defaultProviderId: settings.defaultProviderId,
      enableFallback: settings.enableFallback,
    },
  });

  const handleSavePrefs = (values: PrefsValues) => {
    update({ defaultProviderId: values.defaultProviderId, enableFallback: values.enableFallback });
    toast.success("AI preferences saved");
  };

  const handleReset = () => {
    reset();
    setTheme("system");
    setResetOpen(false);
    toast.success("Preferences reset to defaults");
  };

  const samplePayload = `// POST /automations/run  (example payload)
{
  "prompt": "Research the EV subscription market…",
  "provider": "${settings.defaultProviderId}",
  "fallback": ${settings.enableFallback},
  "stream": true
}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Frontend-only preferences — everything persists locally in your browser."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Appearance"
          description="Theme and motion preferences."
        >
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">Theme</p>
              <RadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as ThemeMode)}
                className="grid grid-cols-3 gap-2"
              >
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = theme === option.value;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={`theme-${option.value}`}
                      className={cn(
                        "flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3.5 text-center transition-all duration-200",
                        active
                          ? "border-primary/40 bg-primary/5 shadow-sm"
                          : "border-border hover:border-foreground/25",
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`theme-${option.value}`}
                        className="sr-only"
                      />
                      <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-xs font-medium">{option.label}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>
            <SettingRow
              label="Animations"
              description="Master switch for motion across the interface."
              checked={settings.animations}
              onCheckedChange={(value) => update({ animations: value })}
            />
          </div>
        </Section>

        <Section
          title="AI preferences"
          description="Defaults used for new automation runs."
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSavePrefs)} className="space-y-5">
              <FormSelectField
                control={form.control}
                name="defaultProviderId"
                label="Default provider"
                description="The preferred model for new runs."
                options={AI_PROVIDERS.map((provider) => ({
                  value: provider.id,
                  label: `${provider.name} · ${provider.model}`,
                }))}
              />
              <FormField
                control={form.control}
                name="enableFallback"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-3.5 py-3">
                      <div>
                        <FormLabel>Automatic fallback</FormLabel>
                        <FormDescription>
                          Retry and switch providers on failure.
                        </FormDescription>
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
              <Button type="submit" size="sm" className="cursor-pointer gap-1.5">
                <Zap className="size-3.5" />
                Save AI preferences
              </Button>
            </form>
          </Form>
        </Section>

        <Section
          title="Notifications"
          description="Choose which run events surface as toasts."
        >
          <div className="space-y-2.5">
            <SettingRow
              label="Run started"
              description="Notify when an automation begins."
              checked={settings.notifications.runStarted}
              onCheckedChange={(value) => updateNotifications({ runStarted: value })}
            />
            <SettingRow
              label="Run completed"
              description="Notify when a run finishes successfully."
              checked={settings.notifications.runCompleted}
              onCheckedChange={(value) => updateNotifications({ runCompleted: value })}
            />
            <SettingRow
              label="Run failed"
              description="Notify when a run errors out."
              checked={settings.notifications.runFailed}
              onCheckedChange={(value) => updateNotifications({ runFailed: value })}
            />
            <SettingRow
              label="Fallback engaged"
              description="Notify when a provider fallback fires."
              checked={settings.notifications.fallbackUsed}
              onCheckedChange={(value) => updateNotifications({ fallbackUsed: value })}
            />
          </div>
        </Section>

        <Section
          title="Accessibility"
          description="Comfort and assistive-technology options."
        >
          <div className="space-y-2.5">
            <SettingRow
              label="Reduce motion"
              description="Minimize animations across the app."
              checked={settings.reduceMotion}
              onCheckedChange={(value) => update({ reduceMotion: value })}
            />
            <SettingRow
              label="Announce run results"
              description="Read run state changes aloud to screen readers."
              checked={settings.announceResults}
              onCheckedChange={(value) => update({ announceResults: value })}
            />
            <SettingRow
              label="Keyboard shortcuts"
              description="Enable global shortcuts like ⌘K and ⌘N."
              checked={settings.keyboardShortcuts}
              onCheckedChange={(value) => update({ keyboardShortcuts: value })}
            />
          </div>
        </Section>

        <Section
          title="Developer mode"
          description="Internal details for debugging and gateway integration."
        >
          <div className="space-y-4">
            <SettingRow
              label="Developer mode"
              description="Reveal API payloads and internal wiring."
              checked={settings.devMode}
              onCheckedChange={(value) => update({ devMode: value })}
            />
            <div className="grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3.5 text-xs sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Gateway</p>
                <p className="mt-0.5 font-medium">{GATEWAY_NAME}</p>
              </div>
              <div>
                <p className="text-muted-foreground">API base URL</p>
                <p className="mt-0.5 truncate font-mono font-medium">{API_BASE_URL}</p>
              </div>
            </div>
            {settings.devMode && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Terminal className="size-3.5" />
                  Sample gateway payload
                </p>
                <CodeViewer code={samplePayload} language="json" title="automations.run" maxHeight={200} />
              </div>
            )}
          </div>
        </Section>

        <Section
          title="Keyboard shortcuts"
          description="Global shortcuts available in the app."
        >
          <ul className="divide-y divide-border/60">
            {KEYBOARD_SHORTCUTS.map((shortcut) => (
              <li key={shortcut.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{shortcut.label}</p>
                  <p className="text-xs text-muted-foreground">{shortcut.description}</p>
                </div>
                <KbdGroup>
                  {shortcut.keys.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </KbdGroup>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Danger zone"
          description="Restore every preference to its default value."
          className="lg:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
            <div>
              <p className="text-sm font-semibold">Reset preferences</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Theme, providers, notifications, and accessibility settings will return to defaults.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="cursor-pointer gap-1.5"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>
        </Section>
      </div>

      <ConfirmationModal
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset all preferences?"
        description="This restores default settings for appearance, AI preferences, notifications, and accessibility. This can't be undone."
        confirmLabel="Reset preferences"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleReset}
      />
    </div>
  );
}
