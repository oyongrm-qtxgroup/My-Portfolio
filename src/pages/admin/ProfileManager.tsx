import { useEffect, useState } from "react";
import { useAdminProfile } from "@/hooks/admin/useAdminProfile";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

export default function ProfileManager() {
  const { profile, loading, fetchProfile, upsert } = useAdminProfile();
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Hydrate form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setTitle(profile.title);
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setAddress(profile.address ?? "");
      setSummary(profile.summary ?? "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsert({
        full_name: fullName,
        title,
        email: email || null,
        phone: phone || null,
        address: address || null,
        summary: summary || null,
      });
      toast.success("Profile saved");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile / CV</h1>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          This data is used in the downloadable CV/resume PDF. Update it here
          and visitors will always get the latest version.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-text-secondary">
              Full Name *
            </Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-bg-primary border-border-custom"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-text-secondary">
              Job Title *
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-bg-primary border-border-custom"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-text-secondary">
              Email
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-bg-primary border-border-custom"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-text-secondary">
              Phone
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-bg-primary border-border-custom"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs text-text-secondary">
            Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-bg-primary border-border-custom"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs text-text-secondary">
            Profile Summary
          </Label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={5}
            className="bg-bg-primary border-border-custom"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving || !fullName || !title}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Profile
        </Button>
      </div>
    </div>
  );
}
