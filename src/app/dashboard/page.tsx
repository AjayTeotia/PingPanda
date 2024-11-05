import { db } from '@/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardPage from '../_components/DashboardPage';
import DashboardPageContent from './DashboardPageContent';
import CreateCategoryModal from '../_components/CreateCategoryModal';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const Page = async () => {
    const auth = await currentUser();

    if (!auth) {
        redirect("/sign-in");
    }

    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    })

    if (!user) {
        redirect("/sign-in");
    }



    return (
        <DashboardPage
            cta={<CreateCategoryModal >
                <Button>
                    <PlusIcon className='mr-2 size-4' />
                    Add Category
                </Button>
            </CreateCategoryModal>}
            title='Dashboard'
        >
            <DashboardPageContent />
        </DashboardPage>
    )
}

export default Page
