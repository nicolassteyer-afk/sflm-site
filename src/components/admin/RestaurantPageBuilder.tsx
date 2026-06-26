"use client";

import { useMemo, useState } from "react";
import {
  deleteRestaurantBlockAction,
  reorderRestaurantBlocksAction,
  saveRestaurantBlockAction,
} from "@/app/admin/actions";
import { FormField, ToggleField } from "@/components/admin/FormField";

type Block = {
  id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image: string | null;
  gallery: unknown;
  ctaLabel: string | null;
  ctaUrl: string | null;
  variant: string | null;
  displayOrder: number;
  isActive: boolean;
};

const blockTypes = [
  "RESTAURANT_HERO",
  "PRESSURE_TEXT",
  "RITUAL_SECTION",
  "HORIZONTAL_STORY",
  "CLOSING_SECTION",
  "STICKY_CTA",
  "EDITORIAL_TEXT",
  "FULL_WIDTH_IMAGE",
  "IMAGE_TEXT",
  "GALLERY",
  "CTA",
];

export function RestaurantPageBuilder({
  restaurantId,
  publicUrl,
  blocks,
}: {
  restaurantId: string;
  publicUrl: string;
  blocks: Block[];
}) {
  const [orderedBlocks, setOrderedBlocks] = useState(blocks);
  const [selectedId, setSelectedId] = useState(blocks[0]?.id ?? "new");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const selectedBlock = orderedBlocks.find((block) => block.id === selectedId);
  const orderedIds = useMemo(() => orderedBlocks.map((block) => block.id).join(","), [orderedBlocks]);

  function moveDraggedBlock(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setOrderedBlocks((current) => {
      const draggedIndex = current.findIndex((block) => block.id === draggedId);
      const targetIndex = current.findIndex((block) => block.id === targetId);
      if (draggedIndex < 0 || targetIndex < 0) return current;
      const next = [...current];
      const [draggedBlock] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, draggedBlock);
      return next.map((item, itemIndex) => ({ ...item, displayOrder: itemIndex + 1 }));
    });
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setOrderedBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [block] = next.splice(index, 1);
      next.splice(nextIndex, 0, block);
      return next.map((item, itemIndex) => ({ ...item, displayOrder: itemIndex + 1 }));
    });
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)_390px]">
      <aside className="admin-card grid content-start gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-bone">Page restaurant</h2>
            <a className="mt-1 block text-xs font-bold text-bone/45 hover:text-saffron" href={publicUrl} target="_blank">
              Voir la page
            </a>
          </div>
          <button className="admin-button" onClick={() => setSelectedId("new")} type="button">
            Ajouter
          </button>
        </div>

        <form action={reorderRestaurantBlocksAction} className="grid gap-3">
          <input type="hidden" name="restaurantId" value={restaurantId} />
          <input type="hidden" name="orderedIds" value={orderedIds} />
          {orderedBlocks.map((block, index) => (
            <button
              className={`rounded-lg border p-3 text-left transition ${
                selectedId === block.id
                  ? "border-saffron/80 bg-saffron/10"
                  : "border-bone/10 bg-black/10 hover:border-bone/25"
              } ${draggedId === block.id ? "opacity-45" : ""}`}
              draggable
              key={block.id}
              onClick={() => setSelectedId(block.id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                setDraggedId(block.id);
              }}
              onDrop={() => {
                moveDraggedBlock(block.id);
                setDraggedId(null);
              }}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-saffron">
                    {index + 1}. {block.type.replaceAll("_", " ")}
                  </p>
                  <p className="mt-2 font-black text-bone">{block.title || block.ctaLabel || "Bloc sans titre"}</p>
                </div>
                <span className="admin-badge">{block.isActive ? "Actif" : "Off"}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="admin-button px-3 py-2" onClick={(event) => { event.stopPropagation(); moveBlock(block.id, -1); }}>
                  Haut
                </span>
                <span className="admin-button px-3 py-2" onClick={(event) => { event.stopPropagation(); moveBlock(block.id, 1); }}>
                  Bas
                </span>
              </div>
            </button>
          ))}
          {orderedBlocks.length ? (
            <button className="admin-button admin-button-primary" type="submit">
              Enregistrer l'ordre
            </button>
          ) : null}
        </form>
      </aside>

      <div className="admin-card p-5">
        {selectedBlock ? (
          <BlockForm block={selectedBlock} restaurantId={restaurantId} />
        ) : (
          <NewBlockForm restaurantId={restaurantId} nextOrder={orderedBlocks.length + 1} />
        )}
      </div>

      <aside className="admin-card overflow-hidden">
        <div className="border-b border-bone/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-saffron">Preview</p>
          <h2 className="mt-2 text-lg font-black text-bone">Apercu direct</h2>
        </div>
        <div className="max-h-[820px] overflow-y-auto bg-[#fff7df] text-[#2a1511]">
          {orderedBlocks.length ? orderedBlocks.map((block) => (
            <PreviewBlock block={block} key={block.id} />
          )) : (
            <p className="p-6 text-sm font-bold text-[#2a1511]/60">Cree les blocs depuis la page existante.</p>
          )}
        </div>
      </aside>
    </section>
  );
}

function BlockForm({ block, restaurantId }: { block: Block; restaurantId: string }) {
  return (
    <form action={saveRestaurantBlockAction} className="grid gap-4">
      <input type="hidden" name="id" value={block.id} />
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <FormShell block={block} />
      <div className="flex flex-wrap gap-3">
        <button className="admin-button admin-button-primary" type="submit">Enregistrer</button>
        <button className="admin-button" formAction={deleteRestaurantBlockAction} type="submit">Supprimer</button>
      </div>
    </form>
  );
}

function NewBlockForm({ restaurantId, nextOrder }: { restaurantId: string; nextOrder: number }) {
  const block = {
    id: "",
    type: "EDITORIAL_TEXT",
    title: "",
    subtitle: "",
    body: "",
    image: "",
    gallery: [],
    ctaLabel: "",
    ctaUrl: "",
    variant: "",
    displayOrder: nextOrder,
    isActive: true,
  };

  return (
    <form action={saveRestaurantBlockAction} className="grid gap-4">
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <FormShell block={block} />
      <button className="admin-button admin-button-primary" type="submit">Ajouter le bloc</button>
    </form>
  );
}

function FormShell({ block }: { block: Block }) {
  return (
    <>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-saffron">Bloc restaurant</p>
        <h2 className="mt-2 text-2xl font-black text-bone">{block.title || block.ctaLabel || "Nouveau bloc"}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="admin-label">
          Type
          <select className="admin-select" name="type" defaultValue={block.type}>
            {blockTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <FormField label="Ordre" name="displayOrder" type="number" defaultValue={block.displayOrder} />
        <FormField label="Variante" name="variant" defaultValue={block.variant} />
      </div>
      <ToggleField label="Bloc visible" name="isActive" defaultChecked={block.isActive} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Titre" name="title" defaultValue={block.title} />
        <FormField label="Sous-titre" name="subtitle" defaultValue={block.subtitle} />
        <FormField label="Image ou video" name="image" defaultValue={block.image} />
        <FormField label="Liste/Galerie separee par virgules" name="gallery" defaultValue={Array.isArray(block.gallery) ? block.gallery.join(", ") : ""} />
        <FormField label="Bouton label" name="ctaLabel" defaultValue={block.ctaLabel} />
        <FormField label="Bouton URL" name="ctaUrl" defaultValue={block.ctaUrl} />
      </div>
      <FormField label="Texte" name="body" textarea defaultValue={block.body} />
    </>
  );
}

function PreviewBlock({ block }: { block: Block }) {
  if (!block.isActive) return null;

  if (block.type === "PRESSURE_TEXT") {
    return (
      <article className="bg-[#7c1718] p-6 text-[#fff7df]">
        {[block.title, block.subtitle, block.body].filter(Boolean).map((line) => (
          <p className="font-display text-5xl uppercase leading-none" key={line}>{line}</p>
        ))}
      </article>
    );
  }

  if (block.type === "STICKY_CTA") {
    return (
      <article className="border-b border-[#2a1511]/10 p-6">
        <span className="inline-flex bg-[#2a1511] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#fff7df]">
          {block.ctaLabel || "Reserver"}
        </span>
      </article>
    );
  }

  return (
    <article className="border-b border-[#2a1511]/10 p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ef3c19]">
        {block.type.replaceAll("_", " ")}
      </p>
      {block.image ? (
        <div className="mt-4 aspect-[16/9] rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${block.image})` }} />
      ) : null}
      {block.subtitle ? <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#ef3c19]">{block.subtitle}</p> : null}
      {block.title ? <h3 className="mt-3 text-4xl font-black uppercase leading-none">{block.title}</h3> : null}
      {block.body ? <p className="mt-4 text-sm font-bold leading-6 text-[#2a1511]/70">{block.body}</p> : null}
    </article>
  );
}
