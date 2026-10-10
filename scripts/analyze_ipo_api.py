import json
from pathlib import Path
from collections import Counter


INPUT_FILE = (
    Path(__file__).resolve().parent.parent
    / "output"
    / "ipo_api_response.json"
)


def main() -> None:
    with INPUT_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    ipos = data["ipos"]

    print("=" * 70)
    print("IPO API ANALYSIS")
    print("=" * 70)

    print(f"\nTotal IPOs: {len(ipos)}")

    print("\nBOARD")
    for board, count in Counter(
        ipo.get("board") for ipo in ipos
    ).items():
        print(f"  {board}: {count}")

    print("\nSTATUS")
    for status, count in Counter(
        ipo.get("status") for ipo in ipos
    ).items():
        print(f"  {status}: {count}")

    print("\nMAINBOARD IPOs")
    print("-" * 70)

    for ipo in ipos:
        if ipo.get("board") == "MAINBOARD":
            print(
                f"{ipo.get('name')} | "
                f"{ipo.get('status')} | "
                f"{ipo.get('openDate', '')[:10]} -> "
                f"{ipo.get('closeDate', '')[:10]} | "
                f"₹{ipo.get('priceMin')} - ₹{ipo.get('priceMax')} | "
                f"GMP ₹{ipo.get('lastGmp')}"
            )

    print("\nLIFECYCLE PHASE")
    for phase, count in Counter(
        ipo.get("lifecycle", {}).get("phase")
        for ipo in ipos
    ).items():
        print(f"  {phase}: {count}")


if __name__ == "__main__":
    main()
    