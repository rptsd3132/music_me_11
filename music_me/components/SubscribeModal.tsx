"use client";
import { Price, ProductWithPrices } from "@/types";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { postData } from "@/libs/helpers";
import useSubscribeModal from "@/hooks/useSubscribeModel";


interface SubscribeModalProps {
    products : ProductWithPrices[];
}

const formatPrice = (price :Price) => {
    const priceString = new Intl.NumberFormat("en-US", {
        style : "currency",
        currency : price.currency,
        minimumFractionDigits : 0,
    }).format((price.unit_amount || 0)/100);
    return priceString;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
     products
     }) => {
        const subscribModal = useSubscribeModal();
        const {user, isLoading, subscription} = useUser();
        const [priceIdLoading, setPriceIdLoading] = useState<string>();

        const onChange = (open : boolean) => {
            if (!open){
                subscribModal.onClose();
            }
        }

        const handleCheckout = async (price : Price) => {
            setPriceIdLoading(price.id);

            if(!user){
                setPriceIdLoading(undefined);
                return toast.error('You must be logged in to subscribe');    
            }
            if (subscription){
                setPriceIdLoading(undefined);
                return toast('You are already subscribed');    
            }

            try {
                const response = await postData({
                    url : '/api/create-checkout-session',
                    data : {
                        price
                    }
                });

                console.log('Checkout response:', response);
                const { url } = response;

                if (url) {
                    window.location.assign(url);
                } else {
                    toast.error('Failed to generate checkout URL');
                }
            }
            catch(error){
                console.error('Checkout error:', error);
                toast.error((error as Error)?.message || 'An error occurred during checkout')
            }finally {
                setPriceIdLoading(undefined);
            }




            
        };
    let content = (
        <div className="text-center text-lg font-semibold">
           no products found!
        </div>
    );

    if (products.length){
        const productsWithPrices = products.filter(product => product.prices?.length);
        
        if (productsWithPrices.length === 0) {
            content = (
                <div className="text-center text-lg font-semibold">
                    no price available
                </div>
            );
        } else {
            content = (
                <div>
                    {productsWithPrices.map((product) => (
                        <div key={product.id}>
                            {product.prices
                                .filter(price => price.currency?.toUpperCase() === 'USD')
                                .map((price) => (
                                <Button key={price.id}
                                onClick={() => handleCheckout(price)}
                                disabled={isLoading || price.id === priceIdLoading}
                                className="mb-4"
                                >
                                    {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
                                </Button>
                            ))}
                        </div>
                    ))}
                </div>
            )
        }
    }

    if (subscription){
        content = (
            <div className="text-center">
                Already subscribed
            </div>
        )
    }


    return(
        <Modal
            title="Subscribe to our premium"
            description="Listen to music with music_me."
            isOpen={subscribModal.isOpen}
            onChange={onChange}
            showClose={false}
        >
            {content}
        </Modal>
    );
}

export default SubscribeModal;