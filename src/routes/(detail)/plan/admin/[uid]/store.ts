/**
 * The active navigation paths (from -> to)
 */
import { writable } from 'svelte/store';

export {
    setActiveTab,
    activeTab,
    formData,
    setFormData
};

const activeTab = writable({
    tab: 0,
})

const formData = writable({
})

const setActiveTab = (tab: number) => {
    activeTab.set({
        tab
    })
};

const setFormData = (tab: number, data: any) => formData.update(forms => ({ ...forms, [tab]: data }));

