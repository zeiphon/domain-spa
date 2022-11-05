import React from 'react';
import { useState } from 'react';
import { DomainListingWrapperWithClosestStops } from '../../types/app';
import { AuctionSchedule, InspectionSchedule } from '../../types/domain';
import { getDateRange, getDateWithoutTime, getRelativeShortDate, getShortDateAndTime, getShortDay, getTwelveHourTime } from '../../utils/dateTimeHelper';
import './inspectionTimesView.scss';

type InspectionDay = {
    date: Date,
    inspections: InspectionTime[]
}
type InspectionTime = {
    imageSrc: string,
    openingTime: string,
    closingTime: string,
    address: string,
    listingSlug: string
}

function dateCompare(first: Date, second: Date): number {
    return first < second
        ? -1
        : first == second
            ? 0
            : 1;
}

// https://stackoverflow.com/a/44109065
function sortMap<TValue>(input: Map<string, TValue>, ): Map<string, TValue> {
    return new Map(
        Array
          .from(input)
          .sort((a, b) => {
            return dateCompare(new Date(a[0]), new Date(b[0]));
          })
    );
}

function InspectionTimesView(props: {
    results: DomainListingWrapperWithClosestStops[]
}) {
    const { results } = props;

    const inspectionTimes: InspectionTime[] = results && results.length > 0
    ? results.flatMap(x => {
        const result: InspectionTime[] = x.listing.inspectionSchedule?.times
            .filter(t => t && new Date(t.openingTime) > new Date())
            .map(y => {
                return {
                    imageSrc: x.listing.media[0].url,
                    openingTime: y.openingTime,
                    closingTime: y.closingTime,
                    address: x.listing.propertyDetails.displayableAddress,
                    listingSlug: x.listing.listingSlug
                }
            }) ?? [];
        return result;
    })
    : [];

    const inspectionDays: Map<string, InspectionDay> = new Map();

    const now = new Date();
    const futureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4);
    inspectionTimes.map(x => {
        const openingDate = new Date(x.openingTime);

        if (openingDate > futureDate)
            return;

        const date = getDateWithoutTime(openingDate);
        const key = date.toLocaleDateString();

        if (inspectionDays.get(key)) {
            inspectionDays.get(key)!.inspections.push(x);
        } else {
            inspectionDays.set(key, { date: date, inspections: [x] });
        }
    })

    const inspectionMarkup: JSX.Element[] = [];
    const sortedInspectionDays = sortMap(inspectionDays);

    sortedInspectionDays.forEach(x => {
        const shortDate = getRelativeShortDate(x.date.toISOString(), false, false);
        console.log(`insp-${shortDate}`);
        inspectionMarkup.push(
        <>
            <div>{shortDate}</div>
            <ul key={`insp-${shortDate}`} className="ps-0">
                {x.inspections
                    .sort((a, b) => dateCompare(new Date(a.openingTime), new Date(b.openingTime)))
                    .map((x, i) =>
                        <li key={`insp-item-${i}-${x.listingSlug}`} className="my-2">
                            <div className="d-flex item-container">
                                <img src={x.imageSrc} className="inspection-thumbnail me-2" />
                                <div>{getTwelveHourTime(x.openingTime)}<br/>{x.address}</div>
                            </div>
                            <></>
                        </li>
                    )}
            </ul>
        </>
        )
    });

    return <div id="inspection-times-view">
        <h4>Inspection times</h4>
        {inspectionMarkup}
    </div>
}

export default InspectionTimesView;