import {Header, TripCard} from "~/components";
import {type LoaderFunctionArgs, useNavigate, useSearchParams} from "react-router";
import {getAllTrips, getTripById} from "~/routes/api/trips";
import {parseTripData} from "~/lib/utils";
import type {Route} from "./+types/trips";
import {useState} from "react";
import {PagerComponent} from "@syncfusion/ej2-react-grids";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const limit = 4;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10)

    const offset = (page - 1) * limit;
    const {allTrips, total} = await getAllTrips(limit, offset);

    return {
        trips: allTrips.map(({$id, tripDetails, imageUrls}) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? []
        })),
        total
    };
}

const Trips = ({loaderData}: Route.ComponentProps) => {
    const trips = loaderData.trips as Trip[] | [];
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page') || '1');

    const [currentPage, setCurrentPage] = useState(initialPage);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        navigate(`?page=${page}`, {preventScrollReset: true});
    }

    return (
        <main className="all-users wrapper">
            <Header
                title="Trips"
                description="View and edit AI-generated travel plans"
                ctaText="Create a Trip"
                ctaUrl="/trips/create"/>

            <section>
                <h1 className="p-24-semibold text-dark-100 mb-4">
                    Manage Created Trips
                </h1>

                <div className="trip-grid mb-4">
                    {trips.map(({id, name, itinerary, imageUrls, interests, travelStyle, estimatedPrice}) => (
                        <TripCard
                            key={id}
                            id={id}
                            name={name}
                            location={itinerary?.[0].location ?? ''}
                            imageUrl={imageUrls[0]}
                            tags={[interests, travelStyle]}
                            price={estimatedPrice}
                        />
                    ))}
                </div>

                <PagerComponent
                    totalRecordsCount={loaderData.total}
                    pageSize={4}
                    currentPage={currentPage}
                    click={(args) => handlePageChange(args.currentPage)}
                    cssClass="!mb-4"
                />
            </section>
        </main>
    )
}

export default Trips;