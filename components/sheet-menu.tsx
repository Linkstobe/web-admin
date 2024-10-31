import Link from 'next/link'
import { BookUp2, MenuIcon, PanelsTopLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Menu from '@/components/menu'
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from '@/components/ui/sheet'
import Image from 'next/image'

export default function SheetMenu () {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src={`/images/light-logo.png`}
                width={180}
                height={180}
                quality={100}
                alt="Linksto.be Logo"
                priority
              />
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}
