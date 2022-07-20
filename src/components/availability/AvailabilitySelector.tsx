import Button from "../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import Once from "./modes/Once";

const tabs = [
  { label: 'Once', key: 'once' },
  { label: 'Cron', key: 'cron' }
];

const AvailabilitySelector = () => {
  const [active, setActive] = useState(false);
  const [repeatMode, setRepeatMode] = useState(tabs[0].key);
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

          <Once />

          <footer className={$c('center grow-children')}>
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
