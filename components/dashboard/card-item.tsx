import type { Card as CardType } from "@/types"
import { cn, formatAmount, maskCardNumber } from "@/lib/utils"
import { useTheme } from "next-themes"
import CardDarkLogo from "@/assets/images/card.png"
import CardLightLogo from "@/assets/images/card-white.png"
import Image from "next/image"
import CardChip from "@/assets/images/card-chip.svg"
interface CardItemProps {
  card: CardType
  className?: string
}

export function CardItem({ card, className }: CardItemProps) {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const cardClass = cn(
    "relative rounded-3xl  text-white shadow-sm transition-all duration-200 min-h-60 max-h-64 flex flex-col  justify-between",
    {
      "card-dark": card.isDark || isDarkMode,
      "card-light": !card.isDark,
    },
    className
  )

  return (
    <div className={cardClass}>
      <div className="mb-6 flex items-end justify-between px-8 py-4">
        <div>
          <div className="text-sm opacity-80">Balance</div>
          <div className="text-2xl font-bold">{formatAmount(card.balance)}</div>
        </div>

        <Image
          src={CardChip}
          alt="card-chip"
          className={`h-8 w-auto  ${!card.isDark && "brightness-50"}`}
        />
      </div>

      <div className="mb-6 flex justify-between px-8 text-sm ">
        <div>
          <div className="opacity-80">CARD HOLDER</div>
          <div>{card.cardHolder}</div>
        </div>
        <div>
          <div className="opacity-80">VALID THRU</div>
          <div>{card.validThru}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-8 py-2 ">
        <div className="text-xl font-medium">{maskCardNumber(card.cardNumber)}</div>
        <Image
          src={card.isDark ? CardDarkLogo : CardLightLogo}
          alt="card-logo"
          className="h-auto w-14"
        />
      </div>
    </div>
  )
}
