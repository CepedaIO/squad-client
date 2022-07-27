import Button from "../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import Once, {OnceForm} from "./modes/Once";

const tabs = [
  { label: 'Once', key: 'once' },
  { label: 'Cron', key: 'cron' }
];

interface IAvailabilityForm {
  mode: string;
}

interface AvailabilityOnceForm extends IOnceForm, IAvailabilityForm {
  mode: 'once';
}

const AvailabilitySelector = () => {
  const [active, setActive] = useState(false);
  const [repeatMode, setRepeatMode] = useState(tabs[0].key);
  const clickedAvailability = () => setActive(true);

  const onSubmit = (form) => {
    console.log('did submit:', form);
  };

  return (
    <main>
      { !active &&
        <Button variant={"optional"} onClick={clickedAvailability} className={'w-full'}>
          <i className="fa-solid fa-circle-plus mr-3" />
          Availability
        </Button>
      }

      { active &&
        <section className={$c('flex flex-col gap-5')}>
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

          <Once submit={ onSubmit } />
        </section>
      }
    </main>
  )
}

export default AvailabilitySelector;
