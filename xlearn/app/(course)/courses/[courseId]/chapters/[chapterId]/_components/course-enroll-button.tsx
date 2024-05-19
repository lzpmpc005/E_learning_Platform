"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import Payment from "@/app/payment/Payment";
import { Modal } from "react-bootstrap";
import { redirect } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentChapter } from "@/redux/services/chapterSlice";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!userId) {
    toast.error("Please login to enroll in the course");
    return redirect("/auth/login");
  }

  const onClick = async () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentStatus = (status: string | null) => {
    setIsPaymentOpen(false);
    if (status) {
      dispatch(setCurrentChapter(status));
      toast.success("Payment successful");
    } else {
      toast.error("Payment failed, check your account details and try again");
    }
  };

  return (
    <>
      <Button
        onClick={onClick}
        disabled={isPaymentOpen}
        size="sm"
        className="w-full md:w-auto"
      >
        Enroll for {formatPrice(price)}
      </Button>
      <Modal show={isPaymentOpen} onHide={() => setIsPaymentOpen(false)}>
        <Modal.Body>
          <Payment
            userId={userId}
            courseId={courseId}
            handlePaymentStatus={handlePaymentStatus}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
