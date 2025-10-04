import { Loader } from "@/components/common/loaders/Loader";
import { Centered } from "@/components/common/markup/Centered";

export const BlockingLoader = () => {
  return (
    <Centered>
      <Loader />
    </Centered>
  );
};
