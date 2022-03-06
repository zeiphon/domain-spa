import React from 'react';
import { useState } from 'react';
import { AuctionSchedule, InspectionSchedule } from '../../types/domain';
import { getDateRange, getShortDateAndTime, getShortDay } from '../../utils/dateTimeHelper';
import './inspectionTimes.scss';

function InspectionTimes(props: {
    id: string,
    inspectionSchedule?: InspectionSchedule,
    auctionSchedule?: AuctionSchedule
}) {
    const { id, inspectionSchedule, auctionSchedule } = props;
    const [inspectionTimesOpen, setInspectionTimesOpen] = useState(false);

    const times = inspectionSchedule
        && inspectionSchedule.times
        && inspectionSchedule.times.length > 0
        ? inspectionSchedule.times.filter(x => new Date(x.openingTime) > new Date())
        : [];

    const isAuctionTimeInFuture = auctionSchedule
        && auctionSchedule.time
        && new Date(auctionSchedule.time) > new Date();

    return times.length > 0 || isAuctionTimeInFuture
    ? (
        <React.Fragment key={id}>
            <span className="toggle ml-1" onClick={() => setInspectionTimesOpen(!inspectionTimesOpen)}><i className={`icon-${inspectionTimesOpen ? "up" : "down"}-open`} /></span>

            {inspectionTimesOpen &&
                <span className="d-block mt-1 ml-1">
                    <ul className="inspection-times pl-3 mb-2">
                        {times.map(x =>
                            <li key={`${id}-inspection-${x.openingTime}`} className="ml-0 mb-1">{getDateRange(x.openingTime, x.closingTime)}</li>
                        )}
                        {auctionSchedule && auctionSchedule.time &&
                        <li key={`${id}-auction-${auctionSchedule.time}`} className="text-danger ml-0 mb-1"><i className="icon-hammer" /> {getShortDateAndTime(auctionSchedule.time)}</li>
                        }
                    </ul>
                </span>
            }
        </React.Fragment>
    ) : <></>;
}

export default InspectionTimes;