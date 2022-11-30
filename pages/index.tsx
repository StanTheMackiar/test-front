import { GetServerSideProps, NextPage } from 'next';

import { Grid, Typography } from '@mui/material';

import { MainLayout, HotelCard } from '../components';
import { CustomResponse, IQuerySearch } from '../interfaces';
import { date } from '../utils';
import { getHotels } from '../api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';



// interface Props {
//   searchResults: CustomResponse;
//   query: IQuerySearch;
// }


const HomePage: NextPage = () => {

  const { query } = useRouter();
  console.log({query})
  const [searchResults, setSearchResults] = useState<CustomResponse>({} as CustomResponse);

  useEffect(() => {
    getResults();
  }, []);


  const getResults = async() => {
    const res = await getHotels( query as IQuerySearch );
    setSearchResults(res)
  }


  const { destination = '', results = [], totalResults = 0 } = searchResults;
  const { checkIn = '', checkOut = '' } = query as { checkIn: string, checkOut: string }
  const stayDays = date.getDateDifference( checkIn, checkOut )
  console.log({stayDays})


 
  return (
    <MainLayout title={ `Buscar Hoteles | ${ totalResults } results` } description='Encuentra aquí tus hoteles al mejor precio del mercado!' >

      <Typography variant='subtitle1'>{ totalResults } resultados</Typography>
      <Typography marginBottom={ 1 } variant='body1'>{ destination ? destination : 'No se encontro destino' }</Typography>

      {
        results.length > 0
        ? (
            <Grid container spacing={ 3 }>
              {
                results.map( hotel => (
                      <HotelCard key={ hotel.id } hotel={ hotel } stayDays={ stayDays } />
                  ))
              }
            </Grid>
        ) : (
          <Typography variant='h2'>No se encontraron resultados, por favor revise los parámetros</Typography>
        )
      }
    
    </MainLayout>
  )
}





// export const getServerSideProps: GetServerSideProps = async ({ query }) => {

//   const searchResults = await getHotels( query as IQuerySearch )

//   return {
//     props: {
//       searchResults,
//       query,
//     } 
//   }
// }


export default HomePage