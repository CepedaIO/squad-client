import Button from "../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import FormInput from "../inline-block/FormInput";
import Once from "./modes/Once";

const tabs = [
  { label: 'Once', key: 'once' },
  { label: 'Daily', key: 'daily' },
  { label: 'Weekly', key: 'weekly' },
  { label: 'Every', key: 'every' },
  { label: 'Cron', key: 'cron' }
];

const AvailabilitySelector = () => {
  const [active, setActive] = useState(false);
  const [allDay, setAllDay] = useState(true);
  const [repeatMode, setRepeatMode] = useState(tabs[0].key);
  const [repeating, setRepeating] = useState(false);
  const clickedAvailability = () => setActive(true);

  return (
    <main>
      { !active &&
        <Button variant={"optional"} onClick={clickedAvailability} className={'w-full'}>
          <i className="fa-solid fa-circle-plus mr-3" />
          Availability
        </Button>
      }

      { active &&
        <section className={$c('flex flex-col gap-2')}>
          <section className={$c('grid grid-cols-3')}>
            { tabs.map((tab) =>
              <Button
                variant={"tab"}
                active={repeatMode === tab.key}
                key={tab.key}
                onClick={() => setRepeatMode(tab.key)}
              >
                { tab.label }
              </Button>
            )}
          </section>

          <Once label={"When?"} field={"dayStart"}/>

          <Button variant={"toggle"} active={allDay} onClick={() => setAllDay(!allDay)}>
            All day?
          </Button>

          {!allDay && <>
            <FormInput label={"Start"} field={"start"} type={"time"}/>
            <FormInput label={"End"} field={"end"} type={"time"} />
          </>}

          <footer className={$c('center stretch')}>
            <Button variant={"link"}>
              Cancel
            </Button>
            <Button variant={"link"}>
              Add
            </Button>
          </footer>
        </section>
      }
    </main>
  )
}

export default AvailabilitySelector;
