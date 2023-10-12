import * as Yup from "yup";
import { authApiInstance } from "../utils/api";

const roomCodeSchema = Yup.string()
  .required("입장 코드를 입력하세요.")
  .matches(
    /^(?!.*[/?\s<>#%'"/\\{}|^~[\]`]).*$/,
    "입장 코드에 공백 문자, /, <. >, #, %, ', \", {, }, |, ~, [, ], `는 입력할 수 없습니다."
  );
export const roomNameSchema = Yup.string()
  .required("방 이름을 입력하세요.")
  .min(2, "방 이름은 최소 2글자 이상입니다.")
  .max(30, "방 이름은 최대 30글자입니다.");

export const validationSchema = (hasChange, validationResult) =>
  Yup.object().shape({
    name: roomNameSchema,
    code: roomCodeSchema.test("roomName", "사용 중인 입장 코드입니다.", async (code) => {
      if (hasChange.current) {
        if (await roomCodeSchema.isValid(code)) {
          try {
            await authApiInstance.get(`/classrooms/code/${code}/duplication`);
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
    capacity: Yup.number("숫자를 입력하세요.")
      .required("정원을 입력하세요.")
      .positive("정원은 1명 이상입니다.")
      .max(100, "정원은 100명을 넘을 수 없습니다."),
  });
