import React from 'react';
import { useState } from 'react';
import { getDateRange } from '../../utils/dateTimeHelper';
import './inspectionTimes.scss';

function InspectionTimes(props: {
    id: string,
    inspectionSchedule: {
        byAppointment: boolean,
        recurring: boolean;
        times: [{ openingTime: string; closingTime: string }] }
}) {
    const { id, inspectionSchedule } = props;
    const [inspectionTimesOpen, setInspectionTimesOpen] = useState(false);

    return inspectionSchedule && inspectionSchedule.times && inspectionSchedule.times.length > 0
    ? (
        <React.Fragment key={id}>
            <span className="toggle ml-1" onClick={() => setInspectionTimesOpen(!inspectionTimesOpen)}><i className={`icon-${inspectionTimesOpen ? "up" : "down"}-open`} /></span>

            {inspectionTimesOpen &&
                <span className="d-block mt-1 ml-1">
                    <ul className="inspection-times pl-3 mb-1">
                        {inspectionSchedule.times.map(x =>
                            <li className="ml-0">{getDateRange(x.openingTime, x.closingTime)}</li>
                        )}
                    </ul>
                </span>
            }
        </React.Fragment>
    ) : <></>;
}

export default InspectionTimes;