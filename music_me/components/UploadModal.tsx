"use client";

import Modal from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";


import Input from "./Input";
import Button from "./Button";
import uniqid from "uniqid";


import { toast } from "react-hot-toast/headless";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@/providers/SupabaseProvider";

const UploadModal = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const {user} = useUser();
    const supabaseClient = useSupabaseClient();
    const route = useRouter();


    const {
    register,
    handleSubmit,
    reset
    
    } = useForm<FieldValues> ({

        defaultValues :{

            author :'',
            title : '',
            Songs : null,
            image : null
        }
    })

    const onChange = (open : boolean) =>{
         if (!open){

                reset();
            uploadModal.onClose();
         }
    }

    const onSubmit : SubmitHandler <FieldValues>= async (values) =>{

        try {

            setIsLoading(true);

            const imageFile = values.image[0];
            const SongsFile = values.Songs[0];

            if (!imageFile || !SongsFile || !user){
                toast.error('missing fields');
                return;
            }

            
        const uniqueID = uniqid();
        // upload song 

        const {
            data : SongsData,
            error : SongsError


        } = await supabaseClient
        .storage
        .from('songs')
        .upload(`Songs-${values.title}-${uniqueID}`, SongsFile, {
            cacheControl : '3600',
            upsert : false

        });


        if (SongsError){
            setIsLoading(false);

            return toast.error('failed to upload song');
            
        }

        // upload image

         const {
            data : imageData,
            error : imageError

        } = await supabaseClient
        .storage
        .from('images')
        .upload(`image-${values.title}-${uniqueID}`, imageFile, {
            cacheControl : '3600',
            upsert : false

        });


        if (imageError){
            setIsLoading(false);

            return toast.error('failed to upload image');
            
        }

        const {
            error : supabaseError
        } = await supabaseClient
        .from('Songs')
        .insert({
            user_id : user.id,
            title : values.title,
            author: values.author,
            image_path: imageData.path,
            songs_path: SongsData.path
        });

        if (supabaseError){
            setIsLoading(false);
            return toast.error(supabaseError.message);
        }


        route.refresh();
        setIsLoading(false);
        toast.success('song created');
        reset();
        uploadModal.onClose();




        } catch(error){
            toast.error('something went wrong');
        } finally{
            setIsLoading(false);
        }


        // update supabase
    }

        return(
        <Modal
        title="Add to song"
        description="Upload an mp3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}
        >
         <form
         onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
            >
            <Input
                id="title"
                disabled={isLoading}
                {...register('title', {required : true})}
                placeholder="song title"

            />

             <Input
                id="author"
                disabled={isLoading}
                {...register('author', {required : true})}
                placeholder="song author"

            />
            <div>
                <div className="pb-1">
                    select song file
                </div>

                 <Input
                id="Songs"
                type="file"
                disabled={isLoading}
                accept=".mp3"
                {...register('Songs', {required : true})}

            />
            </div>

             <div>
                <div className="pb-1">
                    select an image
                </div>

                 <Input
                id="image"
                type="file"
                disabled={isLoading}
                accept="image/*"
                {...register('image', {required : true})}

            />
            </div>
            <Button  disabled={isLoading} type="submit">
                Create 
            </Button>

         </form>
         

        </Modal>
    );
}

export default UploadModal;