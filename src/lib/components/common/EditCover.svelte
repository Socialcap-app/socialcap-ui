<script lang="ts">
    export let onChangeCover: (event: Event) => void;
</script>

<label for="uploadCover" class="absolute bottom-0 right-0 m-2 cursor-pointer p-2 text-blue-700">
    <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="40" height="40" rx="20" fill="white" />
        <g clip-path="url(#clip0_3046_6900)">
            <path
                d="M19.166 13.3342H15.666C14.2659 13.3342 13.5658 13.3342 13.031 13.6067C12.5606 13.8463 12.1782 14.2288 11.9385 14.6992C11.666 15.234 11.666 15.934 11.666 17.3342V24.3342C11.666 25.7343 11.666 26.4344 11.9385 26.9691C12.1782 27.4396 12.5606 27.822 13.031 28.0617C13.5658 28.3342 14.2659 28.3342 15.666 28.3342H22.666C24.0661 28.3342 24.7662 28.3342 25.301 28.0617C25.7714 27.822 26.1538 27.4396 26.3935 26.9691C26.666 26.4344 26.666 25.7343 26.666 24.3342V20.8342M16.666 23.3342H18.0614C18.4691 23.3342 18.6729 23.3342 18.8647 23.2881C19.0348 23.2473 19.1974 23.18 19.3465 23.0886C19.5147 22.9855 19.6588 22.8414 19.9471 22.5531L27.916 14.5842C28.6064 13.8938 28.6064 12.7745 27.916 12.0842C27.2257 11.3938 26.1064 11.3938 25.416 12.0842L17.447 20.0531C17.1588 20.3414 17.0147 20.4855 16.9116 20.6537C16.8202 20.8028 16.7529 20.9654 16.712 21.1355C16.666 21.3273 16.666 21.5311 16.666 21.9387V23.3342Z"
                stroke="#7E8390"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_3046_6900">
                <rect width="20" height="20" fill="white" transform="translate(10 10)" />
            </clipPath>
        </defs>
    </svg>
    <input type="file" id="uploadCover" class="hidden" accept="image/*" on:change={onChangeCover} />
</label>