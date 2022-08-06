import {DateTime} from "luxon";
import {CustomInputDescriptor} from "../index";
import DurationInput from "./DurationInput";

export const Duration = {
  _descriptor: {
    id: 'datetime',
    input: DurationInput,
  } as CustomInputDescriptor<DateTime>,
};

