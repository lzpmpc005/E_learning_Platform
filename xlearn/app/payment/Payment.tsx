import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./style.module.css";
import Image from "next/image";
import axios from "axios";

interface PaymentProps {
  userId: string;
  courseId: string;
  handlePaymentStatus: (status: string | null) => void;
}

interface FormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
}

const Payment = ({ userId, courseId, handlePaymentStatus }: PaymentProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvv: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `http://localhost:8888/api/courses/${courseId}/checkout`,
          {
            ...formData,
            userId,
          }
        );
        handlePaymentStatus(response.data.updatedAt);
      } catch (error) {
        console.error("Error:", error);
        handlePaymentStatus(null);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.overlay}></div>}
      {isLoading && <div className={styles.loadingSpinner}></div>}
      <form action="#" onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.col}>
            <h3 className={styles.title}>billing address</h3>

            <div className={styles.inputBox}>
              <span>Full Name :</span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="name"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>Email :</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>Address :</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="room-street-locality"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>City :</span>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="leipzig"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>State :</span>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Saxony"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>Zip Code :</span>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="04229"
                required
              />
            </div>
          </div>

          <div className={styles.col}>
            <h3 className={styles.title}>payment</h3>
            <div className={styles.inputBox}>
              <span>cards accepted :</span>
              <Image
                src="/card.jpg"
                alt="cards accepted"
                width={1440}
                height={335}
              />
            </div>

            <div className={styles.inputBox}>
              <span>name of card holder :</span>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="nobody"
                required
              />
            </div>

            <div className={styles.inputBox}>
              <span>credit card number :</span>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234123412341234"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>expire month :</span>
              <input
                type="text"
                name="expireMonth"
                value={formData.expireMonth}
                onChange={handleChange}
                placeholder="11"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>expire year :</span>
              <input
                type="text"
                name="expireYear"
                value={formData.expireYear}
                onChange={handleChange}
                placeholder="2030"
                required
              />
            </div>
            <div className={styles.inputBox}>
              <span>CVV :</span>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="proceed to checkout"
          className={styles.submitBtn}
        />
      </form>
    </div>
  );
};

export default Payment;
