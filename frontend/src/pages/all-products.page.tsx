import { Price } from "@/components/my/Price";
import { setAll } from "@/lib/store/features/content.slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import { Product } from "../components/my/Product";
import { fetcher } from "@/lib/fetcher";

export function AllProductsPage() {
    // const [products, setProducts] = useState<any[] | null>(null);

    const { all: products } = useAppSelector((state) => state.content);
    const dispatch = useAppDispatch();

    useEffect(() => {
        fetcher.getAllProducts()
            .then((products) => {
                dispatch(setAll(products.data));
                // setProducts(products.data);
            });
    }, []);


    let productsList;
    let productsCounter;
    if (products !== null) {
        productsList = (
            products.map((product) => {
                return (
                    <Product
                        key={product.id}
                        product={product}
                        renderPrice={(price) => {
                            return <Price key={price.id} price={price} />;
                        }}
                    />
                );
            })
        );
        productsCounter = <div>{productsList.length} items</div>;
    }

    return (
        <div>
            <h1 className="text-5xl font-bold">All content</h1>
            {productsCounter}
            <div className="flex flex-col">{productsList}</div>
        </div>
    );
}