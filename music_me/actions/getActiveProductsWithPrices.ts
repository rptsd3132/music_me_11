import { ProductWithPrices } from "@/types";
import { Database } from "@/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


const getActiveProductsWithPrices = async () : Promise<ProductWithPrices[]> => {
const cookieStore = await cookies();

const supabase = createServerClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot always set cookies.
        }
      },
    },
  }
);

const {data, error} = await supabase
  .from("products")
  .select('*,prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index') 
  .order('unit_amount', {foreignTable : 'prices'});

  if (error){
    console.log(error);

  }

  
return (data as any)  || [];

}

export default getActiveProductsWithPrices;



