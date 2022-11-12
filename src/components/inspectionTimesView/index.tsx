import React from 'react';
import { DomainListingWrapperWithClosestStops } from '../../types/app';
import { getDateWithoutTime, getRelativeShortDate, getShortDateAndTime, getTwelveHourTime } from '../../utils/dateTimeHelper';
import NewTabLink from '../newTabLink';
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
    listingSlug: string,
    isAuction: boolean,
    auctionTime: string | undefined,
}

function dateCompare(first: Date, second: Date): number {
    return first < second
        ? -1
        : first == second
            ? 0
            : 1;
}

// https://stackoverflow.com/a/44109065
function sortMap<TValue>(input: Map<number, TValue>, ): Map<number, TValue> {
    return new Map(
        Array
            .from(input)
            .sort((a, b) => a[0] - b[0])
    );
}

function getInspectionTimesFronResults(results: DomainListingWrapperWithClosestStops[]): InspectionTime[] {
    return results && results.length > 0
        ? results.flatMap(x => {
            const inspectionTimesResult: InspectionTime[] = x.listing.inspectionSchedule?.times
                .filter(t => t && new Date(t.openingTime) > new Date())
                .map(y => {
                    const hasAuction = !!x.listing.auctionSchedule;
                    const isAuction = hasAuction && x.listing.auctionSchedule?.time == y.closingTime;

                    return {
                        imageSrc: x.listing.media[0].url,
                        openingTime: y.openingTime,
                        closingTime: y.closingTime,
                        address: x.listing.propertyDetails.displayableAddress,
                        listingSlug: x.listing.listingSlug,
                        isAuction: isAuction,
                        auctionTime: x.listing.auctionSchedule?.time
                    }
                }) ?? [];

            return inspectionTimesResult;
        })
        : [];
}

function groupInspectionTimesByDay(inspectionTimes: InspectionTime[]): Map<number, InspectionDay> {
    const inspectionDays: Map<number, InspectionDay> = new Map();

    const now = new Date();
    const futureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
    inspectionTimes.map(x => {
        const openingDate = new Date(x.openingTime);

        if (openingDate > futureDate)
            return;

        const date = getDateWithoutTime(openingDate);
        const key = date.getTime();

        if (inspectionDays.get(key)) {
            inspectionDays.get(key)!.inspections.push(x);
        } else {
            inspectionDays.set(key, { date: date, inspections: [x] });
        }
    });

    return inspectionDays;
}

function buildAuctionMarkup(inspectionTime: InspectionTime): JSX.Element {
    return <span className="icon-wrapper text-danger"><i className="icon-hammer me-1" />
        {getTwelveHourTime(inspectionTime.auctionTime!)}
    </span>
}

function buildInspectionMarkup(inspectionDays: Map<number, InspectionDay>): JSX.Element {
    const inspectionMarkup: JSX.Element[] = [];

    inspectionDays.forEach(x => {
        const shortDate = getRelativeShortDate(x.date.toISOString(), false, false);

        inspectionMarkup.push(
        <div key={`insp-${shortDate}-container`}>
            <div>{shortDate}</div>
            <ul key={`insp-${shortDate}`} className="ps-0">
                {x.inspections
                    .sort((a, b) => dateCompare(new Date(a.openingTime), new Date(b.openingTime)))
                    .map((x, i) =>
                        <li key={`insp-item-${i}-${x.listingSlug}`} className="my-2">
                            <div className="d-flex item-container">
                            <NewTabLink href={`https://domain.com.au/${x.listingSlug}`} label="View" className="text-success text-decoration-none">
                                <img src={x.imageSrc} className="inspection-thumbnail me-2" /></NewTabLink>
                                <div>{getTwelveHourTime(x.openingTime)} {x.isAuction && <>{buildAuctionMarkup(x)}</>}<br/>{x.address}</div>
                            </div>
                        </li>
                    )}
            </ul>
        </div>
        )
    });
    return <>{inspectionMarkup}</>;
}

function buildMarkup(results: DomainListingWrapperWithClosestStops[]): JSX.Element {
    if (!results || results.length === 0)
        return <div>None.</div>

    const inspectionTimes = getInspectionTimesFronResults(results);
    const inspectionDays = groupInspectionTimesByDay(inspectionTimes);
    const sortedInspectionDays = sortMap(inspectionDays);
    const inspectionMarkup = buildInspectionMarkup(sortedInspectionDays);

    return inspectionMarkup;
}

function InspectionTimesView(props: {
    results: DomainListingWrapperWithClosestStops[]
}) {
    const { results } = props;

    return <div id="inspection-times-view">
        {buildMarkup(results)}
    </div>
}

export default InspectionTimesView;