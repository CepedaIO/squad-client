import {RangeEdit, RangeForm, RangeView} from "./modes/Range";
import React, {useState} from "react";
import $c from "classnames";
import Button from "../inline/Button";

export type AvailabilityForm = RangeForm;
export type IAvailability = Array<AvailabilityForm>;

export interface AvailabilityViewProps {
  form: AvailabilityForm;
  onDelete: (form: AvailabilityForm) => void;
  onEdit: (form:AvailabilityForm) => void;
}

export const AvailabilityView = ({
  form, onDelete, onEdit
}: AvailabilityViewProps) => {

  return (
    <RangeView
      form={form}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  )
}

export interface AvailabilityEditProps {
  form?: Partial<AvailabilityForm>;
  onSubmit: (form: AvailabilityForm) => void;
  onCancel: (form?: Partial<AvailabilityForm>) => void;
}

const RangeTab = { label: 'Range', key: 'range' };
const CronTab = { label: 'Cron', key: 'cron' };
const tabs = [RangeTab, CronTab];

export const AvailabilityEdit = ({
  form, onSubmit, onCancel
}: AvailabilityEditProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <main>
      <section className={$c('grid grid-cols-3 mb-8')}>
        { tabs.map((tab) =>
          <Button
            variant={"tab"}
            active={tab === activeTab}
            key={tab.key}
            onClick={() => setActiveTab(tab)}
          >
            { tab.label }
          </Button>
        )}
      </section>

      <RangeEdit
        form={form}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </main>

  )
}
