export const parsePrerequisites = (tricks = []) =>
  tricks.flatMap((trick) =>
    trick.prerequisites.map((prerequisite_id) => ({
      prerequisite_id,
      trick_id: trick.id,
    })),
  );
