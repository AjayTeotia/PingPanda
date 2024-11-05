import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { ReactNode } from "react"
import Heading from "./Heading"

interface DashboardPageProps {
  title: string
  children?: ReactNode
  hideBackButton?: boolean
  cta?: ReactNode
}

const DashboardPage = ({
  title,
  children,
  hideBackButton,
  cta
}: DashboardPageProps) => {
  return (
    <section className="flex-1 h-full w-full flex flex-col">
      <div className="p-6 sm:p-8 flex justify-between border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-8">
          {hideBackButton ? null : (
            <Button className="w-fit bg-white" variant={"outline"}>
              <ArrowLeftIcon className="size-4" />
            </Button>
          )}

          <Heading>{title}</Heading>

          {cta ? <div>{cta}</div> : null}
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  )
}

export default DashboardPage
