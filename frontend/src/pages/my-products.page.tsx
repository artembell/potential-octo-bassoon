import { Product } from "@/components/my/Product";
import { fetcher } from "@/lib/fetcher";
import { setMy } from "@/lib/store/features/content.slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";

export function MyProductsPage() {
    const { my: products } = useAppSelector((state) => state.content);
    const dispatch = useAppDispatch();

    useEffect(() => {
        fetcher.getMyProducts()
            .then(({ data }) => {
                console.log(data);
                dispatch(setMy(data));
                // setProducts(data);
            });
    }, []);



    // let contentList;
    // let contentCounter;
    // if (content !== null) {
    //     contentList = (
    //         content.map((cnt) => {
    //             return (
    //                 <Card key={cnt.id} className="my-[10px]">
    //                     <CardHeader>
    //                         <CardTitle>{cnt.data}</CardTitle>
    //                         {/* <CardDescription>Access to .</CardDescription> */}
    //                     </CardHeader>
    //                     {/* <CardContent className="flex flex-row gap-3">
    //                         <div>{cnt.data}</div>
    //                     </CardContent> */}
    //                 </Card>
    //             );
    //         })
    //     );
    //     contentCounter = <div>{contentList.length} items</div>;
    // }

    let productsList;
    let productsCounter;
    if (products !== null) {
        productsList = (
            products.map((product) => {
                return (
                    <Product
                        key={product.id}
                        product={product}
                    // renderPrice={(price) => {
                    //     return (
                    //         <Card key={cnt.id} className="my-[10px]">
                    //             <CardHeader>
                    //                 <CardTitle>{cnt.data}</CardTitle>
                    //                 {/* <CardDescription>Access to .</CardDescription> */}
                    //             </CardHeader>
                    //             {/* <CardContent className="flex flex-row gap-3">
                    //                                  <div>{cnt.data}</div>
                    //                              </CardContent> */}
                    //         </Card>
                    //     );
                    // }}
                    />
                );
            })
        );
        productsCounter = <div>{productsList.length} items</div>;
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">My</h1>
            {productsCounter}
            <div className="flex flex-col">
                {productsList}
            </div>
        </div>
    );
}