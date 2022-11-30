
import { apiHotel } from ".";
import { SearchResultsMinimized, IQuerySearch, CustomResponse, IApiResponse} from "../interfaces";

const BASE_URL = 'https://hotels4.p.rapidapi.com/properties/list?'
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        "X-RapidAPI-Key": process.env.API_KEY || '',
        "X-RapidAPI-Host": process.env.API_HOST || '',
    },
};

export const getHotels = async({ destinationId = '1447930', pageNumber = '', pageSize = '1', checkIn = '2022-12-10', checkOut = '2022-12-11', adults1 = '1' }: IQuerySearch):Promise<CustomResponse> => {
    
    try {
        const res = await fetch(`${BASE_URL}destinationId=${destinationId}&pageNumber=${pageNumber}&pageSize=${pageSize}&checkIn=${checkIn}&checkOut=${checkOut}&adults1=${adults1}`, options)

        const response: IApiResponse = await res.json();
        const { data } = response;

        const destination = data.body.query.destination.value;
        const totalResults = data.body.searchResults.totalCount;
        const results: SearchResultsMinimized[] = data.body.searchResults.results.map( hotel => ({

                id: hotel.id,
                image: hotel.optimizedThumbUrls.srpDesktop,
                locality: hotel.address.locality,
                name: hotel.name,
                price: hotel.ratePlan.price.exactCurrent,
                reviews: {
                    rating: hotel.guestReviews.rating,
                    scale: hotel.guestReviews.scale,
                    total: hotel.guestReviews.total,
                }
            }))

        return {
            destination,
            results,
            totalResults
        }


    } catch (error) {
        return {
            destination: '',
            results: [],
            totalResults: 0,
        }
    }
}


