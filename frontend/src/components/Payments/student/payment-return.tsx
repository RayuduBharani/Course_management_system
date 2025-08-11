import Loader from "@/components/Loading";
import { RootState } from "@/components/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function StudentPaymentReturn() {
    const location = useLocation()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const params = new URLSearchParams(location.search)
    const paymentId = params.get('paymentId')
    const payerId = params.get("PayerID")
    const {user} = useSelector((state : RootState)=> state.auth)    

    useEffect(() => {
        if (payerId && paymentId) {
            async function CapurePayment() {
                const currentOrderId = sessionStorage.getItem("currentOrderId")
                const newPaymentDetailes = {
                    payerId,
                    paymentId,
                    orderId: currentOrderId,
                    studentId : user.userId
                }
                try {                const response = await fetch("https://course-management-system-2-2wm4.onrender.com/order/capture/stu", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(newPaymentDetailes)
                    })

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json()
                    console.log('Payment capture response:', data);
                    
                    if (data.success) {
                        sessionStorage.removeItem("currentOrderId")
                        navigate("/student/mycourses")
                    } else {
                        const errorMsg = data.message || "Payment capture failed. Please contact support.";
                        console.error('Payment capture failed:', errorMsg);
                        setError(errorMsg)
                    }
                } 
                catch (err) {
                    console.error(err)
                    setError("Payment capture failed. Please try again or contact support.")
                }
            }
            CapurePayment()
        }
    }, [payerId, paymentId, user.userId, navigate])

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="-mt-16">
                {error ? (
                    <div className="text-red-500 font-bold text-center">
                        <p>{error}</p>
                        <button 
                            onClick={() => navigate("/student/mycourses")}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Go to My Courses
                        </button>
                    </div>
                ) : (
                    <>
                        <Loader />
                        <p className="font-bold">Payment processing... please wait</p>
                    </>
                )}
            </div>
        </div>
    )
}
