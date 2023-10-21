

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown'

import {  userSession  } from '../ConnectWallet';

function disconnect() {
  userSession.signUserOut('/')
}

export function UserNav() {
  return (
    <>
    { (userSession.isUserSignedIn()) ?


    <DropdownMenu>
      {console.log(userSession.loadUserData(), "userSession")}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          </DropdownMenuGroup>



        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">STX Adresses</p>
            <div className="text-xs leading-none text-muted-foreground break-words">
            main: {userSession.loadUserData().profile.stxAddress.mainnet}
            </div>
            <p className='text-xs leading-none text-muted-foreground break-words'>
            test: {userSession.loadUserData().profile.stxAddress.testnet}
            </p>
          </div>
          </DropdownMenuLabel>
        <DropdownMenuItem className='py-4'>
        <button className="Connect" onClick={disconnect}>
          Disconnect Wallet
        </button>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
   :
    <div></div>
    }
    </>
  )
}
