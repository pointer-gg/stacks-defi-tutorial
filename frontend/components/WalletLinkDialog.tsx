import { Copy } from "lucide-react"
import { Link } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./forms/input"
import { Label } from "./forms/label"
import ConnectWallet from "./ConnectWallet"

export function WalletLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className=" flex justify-center py-4">

        <Button className="text-center" variant="outline">Connect</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>
            Click the button below to connect your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">

        < ConnectWallet/>
          <Button type="submit" size="sm" className="px-3 flex gap-2">
            <span className="sr-only">Connect your wallet</span>
            <Link className="h-4 flex gap-2 w-4">
            </Link>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
