import * as Yup from "yup";
import axios from "axios";

const usernameSchema = Yup.string()
  .required("이름을 입력하세요.")
  .min(2, "이름은 최소 2글자 이상입니다.")
  .max(10, "이름은 최대 10글자입니다.")
  .matches(
    /^[가-힣a-zA-Z][^!@#$%^&*()_+=[\]{};':"\\|,.<>?\s]*$/,
    "이름에는 특수문자를 포함할 수 없고 숫자로 시작할 수 없습니다."
  );

const emailSchema = Yup.string()
  .required("이메일을 입력하세요.")
  .email("올바른 이메일 형식이 아닙니다.")
  .matches(
    /^(?!.*[/?\s<>#%'"/\\{}|^~[\]`]).*$/,
    "이메일에 공백 문자, /, <. >, #, %, ', \", {, }, |, ~, [, ], `는 입력할 수 없습니다."
  );

export const validationSchema = (hasChange, validationResult) =>
  Yup.object().shape({
    username: usernameSchema,
    email: emailSchema.test("email", "사용 중인 이메일입니다.", async (email) => {
      if (hasChange.current) {
        if (await emailSchema.isValid(email)) {
          try {
            await axios.get(`/members/email/${email}/duplication`);
            validationResult.current = true;
            return true;
          } catch (error) {
            validationResult.current = false;
            return false;
          }
        }
      } else {
        return validationResult.current;
      }
    }),
    password: Yup.string()
      .required("비밀번호를 입력하세요.")
      .min(8, "비밀번호는 최소 8자리 이상입니다")
      .max(16, "비밀번호는 최대 16자리입니다.")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\=[\]{};':"|,.<>?])[^\s]*$/,
        "알파벳, 숫자, 공백을 제외한 특수문자를 모두 포함해야 합니다."
      ),
    password2: Yup.string()
      .required("비밀번호를 다시 입력하세요.")
      .oneOf([Yup.ref("password"), null], "비밀번호가 일치하지 않습니다!"),
  });
