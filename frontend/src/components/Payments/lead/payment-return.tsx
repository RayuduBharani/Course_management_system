import Loader from "@/components/Loading";
import { RootState } from "@/components/store/store";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentReturn() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get("PayerID");
    const {user} = useSelector((state : RootState)=> state.auth);

    useEffect(() => {
        if (payerId && paymentId && user?.userId) {
            async function capturePayment() {
                const currentOrderId = sessionStorage.getItem("currentOrderId");
                console.log("Capturing payment with orderId:", currentOrderId);
                
                const newPaymentDetails = {
                    payerId,
                    paymentId,
                    orderId: currentOrderId,
                    leadId: user.userId
                };
                
                try {
                    const response = await fetch("https://course-management-system-2-2wm4.onrender.com/order/capture", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(newPaymentDetails)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Payment capture response:', data);
                    
                    if (data.success) {
                        sessionStorage.removeItem("currentOrderId");
                        navigate("/lead/mycourses");
                    } else {
                        const errorMsg = data.message || "Payment capture failed. Please contact support.";
                        console.error('Payment capture failed:', errorMsg);
                        toast({
                            title: "Payment Failed",
                            description: errorMsg,
                            variant: "destructive"
                        });
                    }
                } catch (error) {
                    console.error('Payment capture error:', error);
                    toast({
                        title: "Payment Error",
                        description: (error instanceof Error ? error.message : "Failed to process payment"),
                        variant: "destructive"
                    });
                }
            }
            capturePayment();
        }
    }, [payerId, paymentId, user?.userId, navigate]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="-mt-16">
                <Loader />
                <p className="font-bold">Payment processing... please wait</p>
            </div>
        </div>
    );
}
