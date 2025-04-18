import { useMutation, useSelf } from "@/liveblocks.config";

export const useDeleteLayers = () => {
    const selection = useSelf((me) => me.presence.selection);

    return useMutation(
        ({ storage, setMyPresence }) => {
            const liveLayers = storage.get("layers");
            const liveLayerIds = storage.get("layerIds");

            for (const id of selection) {
                liveLayers.delete(id);

                // Index of the layer ID in the ordered layerId list.
                const layerIdIndex = liveLayerIds.indexOf(id);

                if (layerIdIndex !== -1) {
                    liveLayerIds.delete(layerIdIndex);
                }
            }

            setMyPresence({ selection: [] }, { addToHistory: true });
        },
        [selection]
    );
};
