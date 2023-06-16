import { ReactNode} from "react"

export function FormError({children}:ReactNode){
    return(
        <small className="text-red-700 text-sm">{children}</small>
    )
}