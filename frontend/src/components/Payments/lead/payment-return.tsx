import Loader from "@/components/Loading";
import { RootState } from "@/components/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function PaymentReturn() {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const paymentId = params.get('paymentId')
    const payerId = params.get("PayerID")
    const {user} = useSelector((state : RootState)=> state.auth)

    useEffect(() => {
        if (payerId && paymentId) {
            async function CapurePayment() {
                const currentOrderId = sessionStorage.getItem("currentOrderId")
                console.log(currentOrderId)
                const newPaymentDetailes = {
                    payerId,
                    paymentId,
                    orderId: currentOrderId,
                    leadId : user.userId
                }
                const respose = await fetch("https://cms-nij0.onrender.com/lead/order/caputre", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(newPaymentDetailes)
                })
                const data = await respose.json()
                console.log(data)
                if (data.success) {
                    sessionStorage.removeItem("currentOrderId")
                    window.location.href = "mycourses"
                }
            }
            CapurePayment()
        }
    }, [])
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="-mt-16">
                <Loader />
                <p className="font-bold">payment processing ... please wait </p>
            </div>
        </div>
    )
}
