import {
  Modal,
  Stack,
  TextInput,
  Radio,
  Select,
  Checkbox,
  Alert,
  Button,
  PasswordInput,
  Text,
  Divider,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMarathonFormStore } from "../store/MarathonFormStore";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect, useState } from "react";
import { type MarathonModalProps } from "../libs/Marathon";
import { z } from "zod";

const marathonSchema = z
  .object({
    fname: z.string().min(1, { message: "First name is required" }),
    lname: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    plan: z.enum(["funrun", "mini", "half", "full"]),
    gender: z.enum(["male", "female"]),
    password: z
      .string()
      .min(6, { message: "Password must contain at least 6 characters" })
      .max(12, { message: "Password must not exceed 12 characters" }),
    confirmPassword: z.string(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export default function MarathonModal({ opened, onClose }: MarathonModalProps) {
  const [agree, setAgree] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [total, setTotal] = useState(0);

  const {
    fname,
    lname,
    plan,
    gender,
    email,
    setFname,
    setLname,
    setPlan,
    setGender,
    setEmail,
    reset,
  } = useMarathonFormStore();

  const discountCoupon = (plan: string, couponCode: string) => {
    let price = 0;
    if (plan === "funrun") price = 500;
    if (plan === "mini") price = 800;
    if (plan === "half") price = 1200;
    if (plan === "full") price = 1500;

    if (couponCode === "CMU2025") {
      price = price * 0.7; 
    }
    return price;
  };

  useEffect(() => {
    setTotal(discountCoupon(plan, coupon));
  }, [plan, coupon]);

  // Mantine Form
  const mantineForm = useForm({
    initialValues: {
      fname,
      lname,
      plan,
      gender,
      agree,
      email,
      password: "",
      confirmPassword: "",
    },
    validate: zod4Resolver(marathonSchema),
    validateInputOnChange: true,
  });

  const onSubmitRegister = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Register CMU Marathon 🏃‍♂️"
      centered
      size="xl"
    >
      <form onSubmit={mantineForm.onSubmit(onSubmitRegister)}>
        <Stack>
          <Group justify="space-between" gap="xs" grow>
            <TextInput
              label="First name"
              withAsterisk
              value={fname}
              onChange={(e) => {
                setFname(e.currentTarget.value);
                mantineForm.setFieldValue("fname", e.currentTarget.value);
              }}
              error={mantineForm.errors.fname}
            />
            <TextInput
              label="Last name"
              withAsterisk
              value={lname}
              onChange={(e) => {
                setLname(e.currentTarget.value);
                mantineForm.setFieldValue("lname", e.currentTarget.value);
              }}
              error={mantineForm.errors.lname}
            />
          </Group>
          <TextInput
            label="Email"
            withAsterisk
            description="ex.excemble@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
              mantineForm.setFieldValue("email", e.currentTarget.value);
            }}
            error={mantineForm.errors.email}
          />

          <PasswordInput
            label="Password"
            description="Password must contain 6-12 characters"
            withAsterisk
            value={mantineForm.values.password}
            onChange={(e) =>
              mantineForm.setFieldValue("password", e.currentTarget.value)
            }
            error={mantineForm.errors.password}
          />
          <PasswordInput
            label="Confirm Password"
            description="Re-enter password"
            withAsterisk
            value={mantineForm.values.confirmPassword}
            onChange={(e) =>
              mantineForm.setFieldValue(
                "confirmPassword",
                e.currentTarget.value
              )
            }
            error={mantineForm.errors.confirmPassword}
          />

          <Select
            label="Plan"
            placeholder="Please select.."
            data={[
              { value: "funrun", label: "Fun run 5.5 Km (500 THB)" },
              { value: "mini", label: "Mini Marathon 10 Km (800 THB)" },
              { value: "half", label: "Half Marathon 21 Km (1,200 THB)" },
              { value: "full", label: "Full Marathon 42.195 Km (1,500 THB)" },
            ]}
            value={plan}
            onChange={(value) => {
              if (value !== null) {
                const v = value as "funrun" | "mini" | "half" | "full";
                setPlan(v);
                mantineForm.setFieldValue("plan", v);
              }
            }}
            error={mantineForm.errors.plan}
          />

          <Radio.Group
            label="Gender"
            value={gender}
            onChange={(value) => {
              if (value !== null) {
                const v = value as "male" | "female";
                setGender(v);
                mantineForm.setFieldValue("gender", v);
              }
            }}
            error={mantineForm.errors.gender}
          >
            <Radio m={4} value="male" label="Male 👨" />
            <Radio m={4} value="female" label="Female 👩" />
          </Radio.Group>

          <Alert color="blue" title="Promotion 📢">
            Coupon (30% Discount)
          </Alert>
          {/* เลือกกรอก coupon ตรงนี้ */}
          <Checkbox
            label="I have coupon"
            checked={hasCoupon}
            onChange={(e) => setHasCoupon(e.currentTarget.checked)}
          />
          {/* แสดงเฉพาะตอนเลือก coupon */}
          {hasCoupon && (
            <TextInput
              label="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.currentTarget.value)}
            />
          )}
          {/* ✅ แสดงราคาการสมัคร */}
          <Text fw="bold">Total Payment : {total} THB</Text>
          <Divider my="xs" variant="dashed" />

          <Checkbox
            label={
              <>
                I accept
                <Text mx={2} span c="red" inherit>
                  terms and conditions
                </Text>
              </>
            }
            checked={agree}
            onChange={(e) => {
              setAgree(e.currentTarget.checked);
              mantineForm.setFieldValue("agree", e.currentTarget.checked);
            }}
            error={mantineForm.errors.agree}
          />

          <Button type="submit" disabled={!mantineForm.values.agree}>
            Register
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
