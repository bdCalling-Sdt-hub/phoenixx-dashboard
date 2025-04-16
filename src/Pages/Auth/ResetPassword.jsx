import { Button, Form, Input, ConfigProvider, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/apiSlices/authApi";
import Spinner from "../../components/common/Spinner";

const ResetPassword = () => {
  const email = new URLSearchParams(location.search).get("email");
  const navigate = useNavigate();
  const [resetPassword, { isLoading, isError }] = useResetPasswordMutation();
  const onFinish = async (values) => {
    try {
      const res = await resetPassword({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap();

      if (res?.success === true) {
        message.success("Password reset successfully");
        navigate("/auth/login");
        localStorage.removeItem("otpSuccessToken");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      message.error("Error: ", error);
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[25px] font-semibold mb-6">Reset Password</h1>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelColor: "black",
            },
          },
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="newPassword"
            label={
              <p
                style={{
                  display: "block",
                }}
                htmlFor="email"
                className="text-base font-normal text-black"
              >
                New Password
              </p>
            }
            rules={[
              {
                required: true,
                message: "Please input your new Password!",
              },
            ]}
            style={{ marginBottom: "16px" }}
          >
            <Input.Password
              type="password"
              placeholder="Enter New password"
              style={{
                border: "1px solid #E0E4EC",
                height: 45,
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "16px" }}
            label={
              <p
                style={{
                  display: "block",
                }}
                htmlFor="email"
                className="text-base text-black font-normal"
              >
                Confirm Password
              </p>
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter Confirm password"
              style={{
                border: "1px solid #E0E4EC",
                height: 45,
                background: "white",
                borderRadius: "8px",
                outline: "none",
              }}
              className=""
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "16px" }}>
            {" "}
            {/* Same margin for button */}
            <Button
              htmlType="submit"
              style={{
                height: 45,
              }}
              className="w-full bg-smart text-[18px] font-normal border-none text-white outline-none mt-4"
            >
              {isLoading ? <Spinner label="Updating..." /> : "Update"}
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default ResetPassword;
