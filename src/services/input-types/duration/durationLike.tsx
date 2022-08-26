import {InputDescriptor} from "../index";
import DurationInput from "./DurationInput";
import {Duration, DurationLikeObject} from 'luxon';
import {ist} from "../../utils";

export const DurationLike: InputDescriptor<DurationLikeObject> = {
  id: 'datetime',
  input: DurationInput,
  ist: ist<DurationLikeObject>((val) => {
    debugger;
    try {
      Duration.fromDurationLike(val)
      return true;
    } catch (e) {
      return false;
    }
  })
};

