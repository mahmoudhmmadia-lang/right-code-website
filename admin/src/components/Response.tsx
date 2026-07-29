import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { lang, response } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { useSignals } from "@preact/signals-react/runtime";

function Response() {
  useSignals();

  if (!response.value) return null;
  const copy = ADMIN_TRANSLATOR[lang.value];

  return (
    <Dialog
      open={Boolean(response.value)}
      onOpenChange={() => (response.value = undefined)}
    >
      <DialogContent>
        <h2 className="text-lg font-semibold capitalize">
          {copy[response.value.type]}
        </h2>
        <p className="text-sm text-muted-foreground">{response.value.message}</p>
        <Button className="mt-2" onClick={() => (response.value = undefined)}>
          {copy.okay}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default Response;
